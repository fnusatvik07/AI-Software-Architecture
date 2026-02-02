"""
DocuQuery POC - Simple RAG Demo (No Chromadb)
Stage 2: Proof of Concept - Lightweight Version

This version uses in-memory vector search with OpenAI embeddings.
Works with Python 3.14 and has minimal dependencies.

Run with: streamlit run poc/app_simple.py
"""

import os
from pathlib import Path
import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv
import numpy as np

# Load environment variables from .env
load_dotenv()

# --- Configuration ---
DOCS_DIR = "poc/documents"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
TOP_K = 3

# --- Initialize OpenAI Client ---
client = OpenAI()

# --- Helper Functions ---

def load_documents():
    """Load all markdown documents from the documents folder."""
    documents = []
    docs_path = Path(DOCS_DIR)
    
    if not docs_path.exists():
        st.error(f"Documents directory not found: {DOCS_DIR}")
        return []
    
    for md_file in docs_path.glob("**/*.md"):
        try:
            content = md_file.read_text()
            documents.append({
                "source": md_file.name,
                "content": content
            })
        except Exception as e:
            st.warning(f"Error reading {md_file}: {e}")
    
    return documents


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
    
    return chunks


def get_embedding(text: str) -> list[float]:
    """Get embedding for a text using OpenAI."""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding


def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


@st.cache_resource
def build_index():
    """Build the document index with embeddings."""
    documents = load_documents()
    
    if not documents:
        return [], []
    
    index = []
    
    with st.spinner("Building document index..."):
        progress_bar = st.progress(0)
        total_chunks = 0
        
        # First pass: count total chunks
        for doc in documents:
            total_chunks += len(chunk_text(doc["content"]))
        
        # Second pass: build index
        chunk_count = 0
        for doc in documents:
            chunks = chunk_text(doc["content"])
            for chunk in chunks:
                embedding = get_embedding(chunk)
                index.append({
                    "source": doc["source"],
                    "content": chunk,
                    "embedding": embedding
                })
                chunk_count += 1
                progress_bar.progress(chunk_count / total_chunks)
        
        progress_bar.empty()
    
    return index, documents


def search(query: str, index: list, top_k: int = TOP_K) -> list:
    """Search for most relevant chunks."""
    query_embedding = get_embedding(query)
    
    # Calculate similarities
    results = []
    for item in index:
        similarity = cosine_similarity(query_embedding, item["embedding"])
        results.append({
            "source": item["source"],
            "content": item["content"],
            "score": similarity
        })
    
    # Sort by similarity and return top k
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]


def generate_answer(question: str, context: str) -> str:
    """Generate answer using GPT-4o."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": """You are a helpful assistant that answers questions based on the provided context.

Rules:
1. Only answer based on the context provided
2. If the answer is not in the context, say "I don't have information about that in the documents"
3. Always cite which document your answer comes from
4. Be concise but complete"""
            },
            {
                "role": "user",
                "content": f"""Context:
{context}

Question: {question}"""
            }
        ],
        temperature=0
    )
    return response.choices[0].message.content


# --- Streamlit UI ---

st.set_page_config(
    page_title="DocuQuery POC",
    page_icon="📄",
    layout="wide"
)

st.title("📄 DocuQuery POC - Simple RAG Demo")
st.markdown("""
**Stage 2: Proof of Concept** - Lightweight version using OpenAI embeddings with in-memory vector search.

This demo shows the core RAG (Retrieval-Augmented Generation) pattern:
1. **Load** documents from the documents folder
2. **Chunk** documents into smaller pieces
3. **Embed** chunks using OpenAI text-embedding-3-small
4. **Search** for relevant chunks using cosine similarity
5. **Generate** answers using GPT-4o
""")

st.divider()

# Sidebar
with st.sidebar:
    st.header("⚙️ Configuration")
    st.write(f"**Chunk Size:** {CHUNK_SIZE}")
    st.write(f"**Chunk Overlap:** {CHUNK_OVERLAP}")
    st.write(f"**Top K Results:** {TOP_K}")
    st.write(f"**Embedding Model:** text-embedding-3-small")
    st.write(f"**LLM Model:** gpt-4o")
    
    st.divider()
    
    if st.button("🔄 Rebuild Index"):
        st.cache_resource.clear()
        st.rerun()

# Main content
col1, col2 = st.columns([2, 1])

with col1:
    st.header("💬 Ask a Question")
    
    # Build index
    index, documents = build_index()
    
    if not index:
        st.warning("No documents found. Please add .md files to the documents folder.")
    else:
        st.success(f"✅ Indexed {len(index)} chunks from {len(documents)} documents")
        
        # Question input
        question = st.text_input("Enter your question:", placeholder="What is DocuQuery?")
        
        if question:
            with st.spinner("Searching and generating answer..."):
                # Search for relevant chunks
                results = search(question, index)
                
                # Build context
                context_parts = []
                for i, result in enumerate(results, 1):
                    context_parts.append(f"[Source {i}: {result['source']}]\n{result['content']}")
                context = "\n\n---\n\n".join(context_parts)
                
                # Generate answer
                answer = generate_answer(question, context)
            
            # Display answer
            st.subheader("📝 Answer")
            st.write(answer)
            
            # Display sources
            st.subheader("📚 Sources")
            for i, result in enumerate(results, 1):
                with st.expander(f"Source {i}: {result['source']} (Score: {result['score']:.3f})"):
                    st.text(result['content'])

with col2:
    st.header("📑 Documents")
    
    if documents:
        for doc in documents:
            with st.expander(f"📄 {doc['source']}"):
                st.text(doc['content'][:500] + "..." if len(doc['content']) > 500 else doc['content'])
    else:
        st.info("No documents loaded")

# Sample questions
st.divider()
st.subheader("💡 Sample Questions")
sample_questions = [
    "What is DocuQuery?",
    "How does RAG work?",
    "What are the main features?",
    "What technology stack is used?"
]

cols = st.columns(len(sample_questions))
for i, q in enumerate(sample_questions):
    if cols[i].button(q, key=f"sample_{i}"):
        st.session_state.question = q
        st.rerun()
