"""
DocuQuery - Stage 3 Development Environment
A production-ready RAG application with Streamlit UI
"""

import streamlit as st
import requests
import hashlib
import json
import time
from datetime import datetime
from typing import Optional, List, Dict
import pandas as pd

# Configuration
API_BASE_URL = "http://localhost:8000"

# Page Configuration
st.set_page_config(
    page_title="DocuQuery | Stage 3 Development",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better UI
st.markdown("""
<style>
    /* Main container */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 1200px;
    }
    
    /* Header styling */
    .main-header {
        background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
        padding: 2rem;
        border-radius: 1rem;
        color: white;
        margin-bottom: 2rem;
    }
    
    .main-header h1 {
        margin: 0;
        font-size: 2.5rem;
        font-weight: 800;
    }
    
    .main-header p {
        margin: 0.5rem 0 0 0;
        opacity: 0.9;
        font-size: 1.1rem;
    }
    
    /* Stage badge */
    .stage-badge {
        display: inline-block;
        background: rgba(255,255,255,0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    /* Metric cards */
    .metric-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1.25rem;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: #2563eb;
    }
    
    .metric-label {
        font-size: 0.875rem;
        color: #64748b;
        margin-top: 0.25rem;
    }
    
    /* Document card */
    .doc-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1rem;
        margin-bottom: 0.75rem;
        transition: all 0.2s;
    }
    
    .doc-card:hover {
        border-color: #2563eb;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
    }
    
    .doc-title {
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 0.25rem;
    }
    
    .doc-meta {
        font-size: 0.8rem;
        color: #64748b;
    }
    
    /* Status indicators */
    .status-healthy {
        color: #059669;
        font-weight: 600;
    }
    
    .status-unhealthy {
        color: #dc2626;
        font-weight: 600;
    }
    
    /* Log entry */
    .log-entry {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        padding: 0.5rem;
        border-radius: 0.25rem;
        margin-bottom: 0.25rem;
    }
    
    .log-info {
        background: #eff6ff;
        color: #1e40af;
    }
    
    .log-success {
        background: #f0fdf4;
        color: #166534;
    }
    
    .log-error {
        background: #fef2f2;
        color: #991b1b;
    }
    
    .log-warning {
        background: #fffbeb;
        color: #92400e;
    }
    
    /* Query result */
    .answer-box {
        background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
        border: 1px solid #86efac;
        border-radius: 0.75rem;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .source-chip {
        display: inline-block;
        background: #dbeafe;
        color: #1e40af;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    /* Architecture info */
    .arch-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 0.5rem;
    }
    
    .arch-title {
        font-weight: 600;
        color: #2563eb;
        margin-bottom: 0.25rem;
    }
    
    /* Sidebar styling */
    .sidebar .sidebar-content {
        background: #f8fafc;
    }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: #f1f5f9;
    }
    
    ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
</style>
""", unsafe_allow_html=True)


# Initialize session state
if 'logs' not in st.session_state:
    st.session_state.logs = []
if 'documents' not in st.session_state:
    st.session_state.documents = {}
if 'document_hashes' not in st.session_state:
    st.session_state.document_hashes = set()
if 'query_history' not in st.session_state:
    st.session_state.query_history = []


def add_log(message: str, level: str = "info"):
    """Add a log entry to session state."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    st.session_state.logs.insert(0, {
        "timestamp": timestamp,
        "message": message,
        "level": level
    })
    # Keep only last 100 logs
    st.session_state.logs = st.session_state.logs[:100]


def compute_content_hash(content: str) -> str:
    """Compute hash of document content for duplicate detection."""
    return hashlib.sha256(content.encode()).hexdigest()[:16]


def check_api_health() -> Dict:
    """Check API health status."""
    try:
        response = requests.get(f"{API_BASE_URL}/api/v1/health", timeout=5)
        return response.json()
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}


def upload_document(content: str, filename: str, file_type: str) -> Dict:
    """Upload a document to the API."""
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/v1/documents/upload",
            json={
                "content": content,
                "filename": filename,
                "file_type": file_type
            },
            timeout=60
        )
        return response.json()
    except Exception as e:
        return {"status": "failed", "message": str(e)}


def query_documents(question: str) -> Dict:
    """Query the RAG system."""
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/v1/query",
            json={"question": question},
            timeout=60
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}


def get_document_stats() -> Dict:
    """Get document statistics."""
    try:
        response = requests.get(f"{API_BASE_URL}/api/v1/documents/stats", timeout=5)
        return response.json()
    except:
        return {"total_documents": len(st.session_state.documents), "total_chunks": 0}


# Sidebar
with st.sidebar:
    st.markdown("### 🚀 DocuQuery")
    st.markdown("**Stage 3: Development**")
    st.markdown("---")
    
    # API Status
    st.markdown("#### System Status")
    health = check_api_health()
    
    if health.get("status") == "healthy":
        st.success("✅ API Online")
        
        components = health.get("components", {})
        col1, col2 = st.columns(2)
        with col1:
            vs_status = components.get("vector_store", {}).get("status", "unknown")
            if vs_status == "healthy":
                st.markdown("🟢 Vector Store")
            else:
                st.markdown("🔴 Vector Store")
        with col2:
            llm_status = components.get("llm", {}).get("status", "unknown")
            if llm_status == "healthy":
                st.markdown("🟢 LLM")
            else:
                st.markdown("🔴 LLM")
    else:
        st.error("❌ API Offline")
        st.caption("Start the API server first")
    
    st.markdown("---")
    
    # Architecture Info
    st.markdown("#### Architecture")
    st.markdown("""
    <div class="arch-box">
        <div class="arch-title">🔧 Backend</div>
        <small>FastAPI + Uvicorn</small>
    </div>
    <div class="arch-box">
        <div class="arch-title">🧠 LLM</div>
        <small>OpenAI GPT-4o</small>
    </div>
    <div class="arch-box">
        <div class="arch-title">📊 Embeddings</div>
        <small>text-embedding-3-large</small>
    </div>
    <div class="arch-box">
        <div class="arch-title">🗄️ Vector DB</div>
        <small>Qdrant (In-Memory)</small>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Config
    st.markdown("#### Configuration")
    st.code("""
CHUNK_SIZE: 500
CHUNK_OVERLAP: 50
TOP_K: 5
SCORE_THRESHOLD: 0.3
    """, language="yaml")
    
    st.markdown("---")
    st.markdown("#### About")
    st.caption("Part of AI Software Architecture Workshop - demonstrating production-ready development practices.")


# Main Header
st.markdown("""
<div class="main-header">
    <div class="stage-badge">🔷 STAGE 3</div>
    <h1>DocuQuery Development Environment</h1>
    <p>Production-ready RAG application with FastAPI, Qdrant, and GPT-4o</p>
</div>
""", unsafe_allow_html=True)

# Metrics Row
col1, col2, col3, col4 = st.columns(4)

stats = get_document_stats()
with col1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{len(st.session_state.documents)}</div>
        <div class="metric-label">Documents</div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    total_chunks = sum(d.get('chunk_count', 0) for d in st.session_state.documents.values())
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{total_chunks}</div>
        <div class="metric-label">Chunks</div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{len(st.session_state.query_history)}</div>
        <div class="metric-label">Queries</div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    api_status = "🟢" if health.get("status") == "healthy" else "🔴"
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-value">{api_status}</div>
        <div class="metric-label">API Status</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Main Tabs
tab1, tab2, tab3, tab4 = st.tabs(["📤 Upload Documents", "❓ Ask Questions", "📁 Manage Documents", "📋 Logs"])

# Tab 1: Upload Documents
with tab1:
    st.markdown("### Upload Documents")
    st.markdown("Upload documents to be chunked, embedded, and stored in the vector database.")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        upload_method = st.radio(
            "Upload Method",
            ["📝 Paste Text", "📄 Upload File"],
            horizontal=True
        )
        
        if upload_method == "📝 Paste Text":
            doc_name = st.text_input("Document Name", placeholder="e.g., company_policy.txt")
            doc_content = st.text_area(
                "Document Content",
                height=200,
                placeholder="Paste your document content here..."
            )
            file_type = "text"
            
        else:
            uploaded_file = st.file_uploader(
                "Choose a file",
                type=["txt", "md", "pdf"],
                help="Supported formats: TXT, Markdown, PDF"
            )
            
            if uploaded_file:
                doc_name = uploaded_file.name
                if uploaded_file.type == "application/pdf":
                    st.warning("PDF support requires pypdf. Content will be extracted.")
                    doc_content = uploaded_file.read().decode('utf-8', errors='ignore')
                    file_type = "pdf"
                else:
                    doc_content = uploaded_file.read().decode('utf-8')
                    file_type = "text" if uploaded_file.name.endswith('.txt') else "markdown"
                
                st.info(f"📄 **{doc_name}** - {len(doc_content)} characters")
            else:
                doc_name = ""
                doc_content = ""
                file_type = "text"
        
        # Upload button
        if st.button("🚀 Upload & Process", type="primary", use_container_width=True):
            if not doc_name or not doc_content:
                st.error("Please provide both document name and content.")
                add_log("Upload failed: Missing name or content", "error")
            else:
                # Check for duplicates
                content_hash = compute_content_hash(doc_content)
                
                if content_hash in st.session_state.document_hashes:
                    st.error("⚠️ **Duplicate Document Detected!**")
                    st.warning("This document has already been uploaded. Duplicate documents are blocked to prevent redundant data.")
                    add_log(f"Duplicate blocked: {doc_name}", "warning")
                else:
                    with st.spinner("Processing document..."):
                        add_log(f"Uploading: {doc_name}", "info")
                        
                        result = upload_document(doc_content, doc_name, file_type)
                        
                        if result.get("status") == "indexed":
                            st.success(f"✅ **Document uploaded successfully!**")
                            st.info(f"Created **{result.get('chunk_count', 0)}** chunks")
                            
                            # Store document info
                            doc_id = result.get("document_id")
                            st.session_state.documents[doc_id] = {
                                "name": doc_name,
                                "content_preview": doc_content[:200] + "..." if len(doc_content) > 200 else doc_content,
                                "chunk_count": result.get("chunk_count", 0),
                                "uploaded_at": datetime.now().isoformat(),
                                "hash": content_hash,
                                "size": len(doc_content)
                            }
                            st.session_state.document_hashes.add(content_hash)
                            
                            add_log(f"Success: {doc_name} ({result.get('chunk_count', 0)} chunks)", "success")
                        else:
                            st.error(f"❌ Upload failed: {result.get('message', 'Unknown error')}")
                            add_log(f"Failed: {result.get('message', 'Unknown error')}", "error")
    
    with col2:
        st.markdown("#### Processing Pipeline")
        st.markdown("""
        <div style="background: #f8fafc; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0;">
            <p style="margin: 0.5rem 0;"><strong>1. Load</strong> 📄</p>
            <small>Parse document content</small>
            <hr style="margin: 0.75rem 0; border-color: #e2e8f0;">
            <p style="margin: 0.5rem 0;"><strong>2. Chunk</strong> ✂️</p>
            <small>Split into 500-char pieces</small>
            <hr style="margin: 0.75rem 0; border-color: #e2e8f0;">
            <p style="margin: 0.5rem 0;"><strong>3. Embed</strong> 🧠</p>
            <small>Generate 3072-dim vectors</small>
            <hr style="margin: 0.75rem 0; border-color: #e2e8f0;">
            <p style="margin: 0.5rem 0;"><strong>4. Store</strong> 🗄️</p>
            <small>Index in Qdrant</small>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### Duplicate Detection")
        st.markdown("""
        <div style="background: #fffbeb; padding: 1rem; border-radius: 0.5rem; border: 1px solid #fcd34d;">
            <small>🔒 Documents are hashed using SHA-256 to detect and block duplicates automatically.</small>
        </div>
        """, unsafe_allow_html=True)

# Tab 2: Ask Questions
with tab2:
    st.markdown("### Ask Questions")
    st.markdown("Query your documents using natural language. The system retrieves relevant context and generates answers using GPT-4o.")
    
    # Query input
    question = st.text_input(
        "Your Question",
        placeholder="e.g., What are the main features of Python?",
        key="query_input"
    )
    
    col1, col2 = st.columns([1, 4])
    with col1:
        query_btn = st.button("🔍 Search", type="primary", use_container_width=True)
    
    if query_btn and question:
        if len(st.session_state.documents) == 0:
            st.warning("⚠️ No documents uploaded yet. Please upload documents first.")
            add_log("Query failed: No documents", "warning")
        else:
            with st.spinner("Searching and generating answer..."):
                start_time = time.time()
                add_log(f"Query: {question[:50]}...", "info")
                
                result = query_documents(question)
                elapsed = time.time() - start_time
                
                if "error" in result:
                    st.error(f"❌ Error: {result['error']}")
                    add_log(f"Query error: {result['error']}", "error")
                else:
                    # Store in history
                    st.session_state.query_history.append({
                        "question": question,
                        "answer": result.get("answer", ""),
                        "timestamp": datetime.now().isoformat(),
                        "latency_ms": result.get("latency_ms", 0)
                    })
                    
                    # Display answer
                    st.markdown("#### Answer")
                    st.markdown(f"""
                    <div class="answer-box">
                        {result.get('answer', 'No answer generated.')}
                    </div>
                    """, unsafe_allow_html=True)
                    
                    # Metrics
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("Latency", f"{result.get('latency_ms', 0)}ms")
                    with col2:
                        st.metric("Tokens Used", result.get('tokens_used', 0))
                    with col3:
                        st.metric("Sources", len(result.get('sources', [])))
                    
                    # Sources
                    sources = result.get('sources', [])
                    if sources:
                        st.markdown("#### Sources")
                        for i, source in enumerate(sources, 1):
                            with st.expander(f"📄 {source.get('document_name', 'Unknown')} (Score: {source.get('relevance_score', 0):.2f})"):
                                st.markdown(f"**Content:**")
                                st.text(source.get('content', ''))
                    
                    add_log(f"Answer generated in {result.get('latency_ms', 0)}ms", "success")
    
    # Query History
    if st.session_state.query_history:
        st.markdown("---")
        st.markdown("#### Recent Queries")
        for q in reversed(st.session_state.query_history[-5:]):
            with st.expander(f"❓ {q['question'][:60]}..."):
                st.markdown(f"**Answer:** {q['answer']}")
                st.caption(f"⏱️ {q['latency_ms']}ms | 🕐 {q['timestamp'][:19]}")

# Tab 3: Manage Documents
with tab3:
    st.markdown("### Document Library")
    st.markdown("View and manage all uploaded documents.")
    
    if not st.session_state.documents:
        st.info("📭 No documents uploaded yet. Go to the Upload tab to add documents.")
    else:
        # Document list
        for doc_id, doc_info in st.session_state.documents.items():
            col1, col2, col3 = st.columns([4, 1, 1])
            
            with col1:
                st.markdown(f"""
                <div class="doc-card">
                    <div class="doc-title">📄 {doc_info['name']}</div>
                    <div class="doc-meta">
                        {doc_info['chunk_count']} chunks • {doc_info['size']} chars • {doc_info['uploaded_at'][:10]}
                    </div>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                if st.button("👁️ View", key=f"view_{doc_id}"):
                    st.session_state[f"show_{doc_id}"] = not st.session_state.get(f"show_{doc_id}", False)
            
            with col3:
                if st.button("🗑️ Delete", key=f"del_{doc_id}", type="secondary"):
                    # Remove from tracking
                    if doc_info.get('hash') in st.session_state.document_hashes:
                        st.session_state.document_hashes.remove(doc_info['hash'])
                    del st.session_state.documents[doc_id]
                    add_log(f"Deleted: {doc_info['name']}", "warning")
                    st.rerun()
            
            # Show content preview
            if st.session_state.get(f"show_{doc_id}", False):
                st.text_area(
                    "Content Preview",
                    doc_info['content_preview'],
                    height=100,
                    disabled=True,
                    key=f"preview_{doc_id}"
                )
        
        # Summary table
        st.markdown("---")
        st.markdown("#### Summary")
        
        df_data = []
        for doc_id, doc_info in st.session_state.documents.items():
            df_data.append({
                "Document": doc_info['name'],
                "Chunks": doc_info['chunk_count'],
                "Size": f"{doc_info['size']:,} chars",
                "Uploaded": doc_info['uploaded_at'][:10]
            })
        
        if df_data:
            df = pd.DataFrame(df_data)
            st.dataframe(df, use_container_width=True, hide_index=True)

# Tab 4: Logs
with tab4:
    st.markdown("### Activity Logs")
    st.markdown("Real-time logs of all operations in the application.")
    
    col1, col2 = st.columns([4, 1])
    with col2:
        if st.button("🗑️ Clear Logs"):
            st.session_state.logs = []
            st.rerun()
    
    if not st.session_state.logs:
        st.info("📋 No logs yet. Perform some actions to see logs here.")
    else:
        for log in st.session_state.logs:
            level_class = {
                "info": "log-info",
                "success": "log-success",
                "error": "log-error",
                "warning": "log-warning"
            }.get(log['level'], "log-info")
            
            level_icon = {
                "info": "ℹ️",
                "success": "✅",
                "error": "❌",
                "warning": "⚠️"
            }.get(log['level'], "ℹ️")
            
            st.markdown(f"""
            <div class="log-entry {level_class}">
                <strong>{log['timestamp']}</strong> {level_icon} {log['message']}
            </div>
            """, unsafe_allow_html=True)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #64748b; font-size: 0.875rem;">
    <p><strong>DocuQuery</strong> | Stage 3: Development Environment</p>
    <p>Part of the AI Software Architecture Workshop</p>
    <p style="margin-top: 0.5rem;">
        <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0 0.25rem;">FastAPI</span>
        <span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0 0.25rem;">OpenAI GPT-4o</span>
        <span style="background: #d1fae5; color: #065f46; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0 0.25rem;">Qdrant</span>
        <span style="background: #ede9fe; color: #5b21b6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; margin: 0 0.25rem;">Pydantic</span>
    </p>
</div>
""", unsafe_allow_html=True)
