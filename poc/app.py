"""
DocuQuery POC - Document Q&A with RAG
Stage 2: Proof of Concept

Run with: streamlit run app.py
"""

import os
import shutil
from pathlib import Path
import streamlit as st
from dotenv import load_dotenv

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# --- Configuration ---
DOCS_DIR = "documents"
PERSIST_DIR = "./chroma_db"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
TOP_K = 3
EMBEDDING_MODEL = "text-embedding-3-large"
LLM_MODEL = "gpt-4o"

# --- Helper Functions ---

def clear_vector_store():
    """Clear the persisted vector store."""
    if os.path.exists(PERSIST_DIR):
        shutil.rmtree(PERSIST_DIR)
        st.cache_resource.clear()

# --- Initialize Components (cached) ---

@st.cache_resource
def load_documents_raw():
    """Load raw documents for viewing."""
    loader = DirectoryLoader(
        DOCS_DIR, 
        glob="**/*.md", 
        loader_cls=TextLoader
    )
    return loader.load()

@st.cache_resource
def load_and_index_documents():
    """Load documents, chunk them, and create vector store."""
    
    # Clear old vector store if exists (dimension mismatch fix)
    if os.path.exists(PERSIST_DIR):
        shutil.rmtree(PERSIST_DIR)
    
    # Load all .md files from documents folder
    loader = DirectoryLoader(
        DOCS_DIR, 
        glob="**/*.md", 
        loader_cls=TextLoader
    )
    documents = loader.load()
    
    # Split into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    chunks = splitter.split_documents(documents)
    
    # Create embeddings (text-embedding-3-large = 3072 dimensions)
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    
    # Create and persist vector store
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name="docuquery_poc",
        persist_directory=PERSIST_DIR
    )
    
    return vectorstore, documents, len(chunks)


@st.cache_resource
def get_llm():
    """Initialize the LLM - OpenAI GPT-4o."""
    return ChatOpenAI(
        model=LLM_MODEL,
        temperature=0
    )


# --- RAG Chain ---

SYSTEM_PROMPT = """You are a helpful assistant that answers questions based on the provided context.

Rules:
1. Only answer based on the context provided
2. If the answer is not in the context, say "I don't have information about that in the documents"
3. Always cite which document your answer comes from
4. Be concise but complete

Context:
{context}
"""

def answer_question(question: str, vectorstore, llm) -> dict:
    """Retrieve relevant chunks and generate answer."""
    
    # Retrieve relevant chunks
    retriever = vectorstore.as_retriever(search_kwargs={"k": TOP_K})
    relevant_docs = retriever.invoke(question)
    
    # Format context
    context_parts = []
    sources = []
    for i, doc in enumerate(relevant_docs, 1):
        source = Path(doc.metadata.get("source", "unknown")).name
        context_parts.append(f"[Source {i}: {source}]\n{doc.page_content}")
        sources.append({
            "source": source,
            "content": doc.page_content
        })
    
    context = "\n\n---\n\n".join(context_parts)
    
    # Generate answer
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{question}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "context": context,
        "question": question
    })
    
    return {
        "answer": response.content,
        "sources": sources
    }


# --- Streamlit UI ---

st.set_page_config(
    page_title="DocuQuery POC",
    page_icon="📄",
    layout="wide"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem 2rem;
        border-radius: 10px;
        color: white;
        margin-bottom: 2rem;
    }
    .main-header h1 {
        margin: 0;
        font-size: 2rem;
    }
    .main-header p {
        margin: 0.5rem 0 0 0;
        opacity: 0.9;
    }
    .stat-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #667eea;
        margin: 0.5rem 0;
    }
    .answer-box {
        background: #f0f7ff;
        padding: 1.5rem;
        border-radius: 10px;
        border: 1px solid #cce5ff;
        margin: 1rem 0;
    }
    .source-tag {
        background: #e9ecef;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        margin-right: 0.5rem;
    }
    .config-badge {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        display: inline-block;
        margin: 0.25rem;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
<div class="main-header">
    <h1>📄 DocuQuery POC</h1>
    <p>Stage 2: Proof of Concept • RAG-powered Document Q&A</p>
</div>
""", unsafe_allow_html=True)

# Load documents and create index
try:
    with st.spinner("🔄 Loading and indexing documents..."):
        vectorstore, raw_documents, num_chunks = load_and_index_documents()
        llm = get_llm()
    
    # Stats row
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("📚 Documents", len(raw_documents))
    with col2:
        st.metric("🧩 Chunks", num_chunks)
    with col3:
        st.metric("🔍 Top-K", TOP_K)
    with col4:
        st.metric("📏 Chunk Size", CHUNK_SIZE)

except Exception as e:
    st.error(f"❌ Error loading documents: {str(e)}")
    st.info("💡 Make sure your OPENAI_API_KEY is set in the .env file")
    st.stop()

st.markdown("---")

# Two column layout
left_col, right_col = st.columns([2, 1])

with left_col:
    # Question input
    st.markdown("### 💬 Ask a Question")
    question = st.text_input(
        "Type your question here:",
        placeholder="e.g., What is the remote work policy?",
        value=st.session_state.get("question", ""),
        label_visibility="collapsed"
    )
    
    if question:
        with st.spinner("🤔 Analyzing documents and generating answer..."):
            result = answer_question(question, vectorstore, llm)
        
        # Display answer
        st.markdown("### 📝 Answer")
        st.markdown(f"""
        <div class="answer-box">
            {result["answer"]}
        </div>
        """, unsafe_allow_html=True)
        
        # Display sources
        st.markdown("### 📖 Retrieved Sources")
        for i, source in enumerate(result["sources"], 1):
            with st.expander(f"📄 Source {i}: {source['source']}", expanded=False):
                st.markdown(source["content"])

with right_col:
    # Sample Questions
    st.markdown("### 💡 Try These Questions")
    sample_questions = [
        "How many days can I work remotely?",
        "What is the refund policy?",
        "How do I reset my password?",
        "What is the annual learning budget?",
        "Does CloudSync Pro integrate with Slack?",
        "What are the support hours?",
    ]
    for q in sample_questions:
        if st.button(q, key=q, use_container_width=True):
            st.session_state["question"] = q
            st.rerun()

st.markdown("---")

# Document Viewer Section
st.markdown("### 📚 Document Library")
st.caption("Click to expand and view document contents")

doc_cols = st.columns(3)
for idx, doc in enumerate(raw_documents):
    doc_name = Path(doc.metadata.get("source", "unknown")).name
    with doc_cols[idx % 3]:
        with st.expander(f"📄 {doc_name}"):
            st.markdown(doc.page_content[:2000] + "..." if len(doc.page_content) > 2000 else doc.page_content)

# Sidebar
with st.sidebar:
    st.markdown("## ⚙️ Configuration")
    
    st.markdown(f"""
    <span class="config-badge">LLM: {LLM_MODEL}</span>
    <span class="config-badge">Embeddings: {EMBEDDING_MODEL}</span>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    st.markdown("### 🔧 RAG Pipeline")
    st.markdown("""
    ```
    Documents
        ↓
    Text Splitter (500 chars)
        ↓
    Embeddings (3072 dim)
        ↓
    ChromaDB Vector Store
        ↓
    Similarity Search (Top 3)
        ↓
    GPT-4o Generation
        ↓
    Answer + Sources
    ```
    """)
    
    st.markdown("---")
    
    st.markdown("### 🗄️ Vector Store")
    st.caption(f"Location: `{PERSIST_DIR}`")
    st.caption(f"Embedding Dimensions: 3072")
    
    if st.button("🗑️ Clear Vector Store", use_container_width=True):
        clear_vector_store()
        st.success("Vector store cleared! Refresh to rebuild.")
        st.rerun()
    
    st.markdown("---")
    st.caption("Stage 2: POC | DocuQuery v0.1")
