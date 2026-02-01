import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Layers, Database, Server, FileCode, GitBranch, 
  ChevronRight, ChevronDown, Folder, FileText, Settings,
  Play, Terminal, Package, TestTube, Rocket, Shield,
  Cpu, Box, ArrowRight, Zap, Check, X, Eye, CheckCircle, AlertCircle, Lock
} from 'lucide-react';

// File tree data
const fileTree = [
  { name: 'docuquery/', type: 'folder', indent: 0 },
  { name: 'src/', type: 'folder', indent: 1 },
  { name: 'api/', type: 'folder', indent: 2 },
  { name: 'main.py', type: 'python', indent: 3, desc: 'FastAPI application entry' },
  { name: 'routes/', type: 'folder', indent: 3 },
  { name: 'health.py', type: 'python', indent: 4 },
  { name: 'documents.py', type: 'python', indent: 4 },
  { name: 'query.py', type: 'python', indent: 4 },
  { name: 'middleware/', type: 'folder', indent: 3 },
  { name: 'logging.py', type: 'python', indent: 4 },
  { name: 'error_handler.py', type: 'python', indent: 4 },
  { name: 'core/', type: 'folder', indent: 2 },
  { name: 'orchestrator.py', type: 'python', indent: 3, desc: 'Main coordinator' },
  { name: 'query_engine.py', type: 'python', indent: 3, desc: 'RAG pipeline' },
  { name: 'exceptions.py', type: 'python', indent: 3 },
  { name: 'ingestion/', type: 'folder', indent: 2 },
  { name: 'loader.py', type: 'python', indent: 3, desc: 'Document loading' },
  { name: 'chunker.py', type: 'python', indent: 3, desc: 'Text chunking' },
  { name: 'processor.py', type: 'python', indent: 3, desc: 'Pipeline' },
  { name: 'retrieval/', type: 'folder', indent: 2 },
  { name: 'embeddings.py', type: 'python', indent: 3, desc: 'OpenAI embeddings' },
  { name: 'vector_store.py', type: 'python', indent: 3, desc: 'Qdrant operations' },
  { name: 'llm/', type: 'folder', indent: 2 },
  { name: 'gateway.py', type: 'python', indent: 3, desc: 'LLM gateway with fallbacks' },
  { name: 'providers/', type: 'folder', indent: 3 },
  { name: 'openai.py', type: 'python', indent: 4, desc: 'GPT-4o provider' },
  { name: 'anthropic.py', type: 'python', indent: 4, desc: 'Claude fallback' },
  { name: 'base.py', type: 'python', indent: 4 },
  { name: 'prompts/', type: 'folder', indent: 2 },
  { name: 'manager.py', type: 'python', indent: 3 },
  { name: 'templates/', type: 'folder', indent: 3 },
  { name: 'v1/', type: 'folder', indent: 4 },
  { name: 'models/', type: 'folder', indent: 2 },
  { name: 'documents.py', type: 'python', indent: 3 },
  { name: 'queries.py', type: 'python', indent: 3 },
  { name: 'common.py', type: 'python', indent: 3 },
  { name: 'tests/', type: 'folder', indent: 1 },
  { name: 'unit/', type: 'folder', indent: 2, desc: '90+ unit tests' },
  { name: 'integration/', type: 'folder', indent: 2, desc: '20+ integration tests' },
  { name: 'e2e/', type: 'folder', indent: 2, desc: '12 E2E tests' },
  { name: 'security/', type: 'folder', indent: 2, desc: '20+ security tests' },
  { name: 'config/', type: 'folder', indent: 1 },
  { name: 'settings.py', type: 'python', indent: 2, desc: 'Pydantic settings' },
  { name: 'docker/', type: 'folder', indent: 1 },
  { name: 'Dockerfile', type: 'docker', indent: 2 },
  { name: 'docker-compose.yml', type: 'yaml', indent: 2 },
  { name: '.github/', type: 'folder', indent: 1 },
  { name: 'workflows/', type: 'folder', indent: 2 },
  { name: 'ci.yml', type: 'yaml', indent: 3, desc: 'CI pipeline' },
  { name: 'requirements.txt', type: 'config', indent: 1 },
  { name: 'pyproject.toml', type: 'config', indent: 1 },
  { name: 'Makefile', type: 'config', indent: 1 },
];

// Code samples
const codeSamples = {
  settings: `# config/settings.py
from pydantic_settings import BaseSettings
from pydantic import Field
from enum import Enum

class LLMProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

class Settings(BaseSettings):
    """Application settings from environment variables."""
    
    # API Keys
    openai_api_key: str = Field(..., description="OpenAI API key")
    anthropic_api_key: Optional[str] = Field(default=None)
    
    # LLM Configuration - Default to OpenAI
    llm_provider: LLMProvider = Field(default=LLMProvider.OPENAI)
    llm_model: str = Field(default="gpt-4o")
    llm_temperature: float = Field(default=0.0)
    
    # Embedding Configuration
    embedding_model: str = Field(default="text-embedding-3-large")
    embedding_dimensions: int = Field(default=3072)
    
    # Vector Store
    qdrant_host: str = Field(default="localhost")
    qdrant_port: int = Field(default=6333)
    
    class Config:
        env_file = ".env"

settings = Settings()`,

  queryEngine: `# src/core/query_engine.py
class QueryEngine:
    """
    RAG Pipeline:
    1. Embed the question
    2. Retrieve relevant chunks
    3. Build context
    4. Generate answer with LLM
    """
    
    def __init__(
        self,
        vector_store: VectorStore,
        embedding_service: EmbeddingService,
        llm_gateway: LLMGateway,
        prompt_manager: PromptManager
    ):
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.llm_gateway = llm_gateway
        self.prompt_manager = prompt_manager
    
    async def query(self, request: QueryRequest) -> QueryResponse:
        start_time = time.time()
        
        # Step 1: Embed the question
        question_embedding = await self.embedding_service.embed_text(
            request.question
        )
        
        # Step 2: Retrieve relevant chunks
        retrieved_chunks = await self.vector_store.search(
            embedding=question_embedding,
            top_k=settings.retrieval_top_k
        )
        
        # Step 3: Build context
        context, sources = self._build_context(retrieved_chunks)
        
        # Step 4: Generate answer
        llm_response = await self.llm_gateway.complete(
            system_prompt=self.prompt_manager.get_prompt("system"),
            user_prompt=self.prompt_manager.render_prompt(
                "query", context=context, question=request.question
            )
        )
        
        return QueryResponse(
            question=request.question,
            answer=llm_response["content"],
            sources=sources,
            latency_ms=int((time.time() - start_time) * 1000),
            tokens_used=llm_response["tokens_used"]
        )`,

  llmGateway: `# src/llm/gateway.py
class LLMGateway:
    """
    LLM Gateway with automatic fallback support.
    Primary: OpenAI GPT-4o
    Fallback: Anthropic Claude (if configured)
    """
    
    def __init__(self):
        self.providers = {}
        self.circuit_breakers = {}
        
        # Primary provider is OpenAI
        self.providers["openai"] = OpenAIProvider()
        self.circuit_breakers["openai"] = CircuitBreaker()
        self.provider_order = ["openai"]
        
        # Add Anthropic as fallback if available
        anthropic_provider = AnthropicProvider()
        if anthropic_provider.is_available:
            self.providers["anthropic"] = anthropic_provider
            self.provider_order.append("anthropic")
    
    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        max_retries: int = 2
    ) -> Dict[str, Any]:
        """Generate completion with automatic fallback."""
        
        for provider_name in self.provider_order:
            provider = self.providers[provider_name]
            circuit_breaker = self.circuit_breakers[provider_name]
            
            if not circuit_breaker.can_execute():
                continue
            
            for attempt in range(max_retries):
                try:
                    result = await provider.complete(
                        system_prompt=system_prompt,
                        user_prompt=user_prompt
                    )
                    circuit_breaker.record_success()
                    return result
                    
                except LLMRateLimitError:
                    await asyncio.sleep(2 ** attempt)
                    
                except LLMProviderError:
                    circuit_breaker.record_failure()
                    break
        
        raise LLMException("All LLM providers failed")`,

  fastapi: `# src/api/main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    logger.info("Starting DocuQuery API...")
    orchestrator = Orchestrator.get_instance()
    await orchestrator.vector_store.initialize()
    yield
    await orchestrator.shutdown()

def create_app() -> FastAPI:
    app = FastAPI(
        title="DocuQuery API",
        description="AI-powered document Q&A with GPT-4o",
        version="1.0.0",
        lifespan=lifespan
    )
    
    # Middleware
    app.add_middleware(CORSMiddleware, allow_origins=["*"])
    app.middleware("http")(error_handler_middleware)
    app.add_middleware(LoggingMiddleware)
    
    # Routes
    app.include_router(health.router, prefix="/api/v1/health")
    app.include_router(documents.router, prefix="/api/v1/documents")
    app.include_router(query.router, prefix="/api/v1/query")
    
    return app

app = create_app()`,

  vectorStore: `# src/retrieval/vector_store.py
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

class VectorStore:
    """Vector store using Qdrant."""
    
    def __init__(self):
        self.client = AsyncQdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port
        )
        self.collection_name = settings.qdrant_collection
        self.vector_size = settings.embedding_dimensions  # 3072
    
    async def initialize(self):
        """Create collection if needed."""
        collections = await self.client.get_collections()
        if self.collection_name not in [c.name for c in collections.collections]:
            await self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=self.vector_size,
                    distance=Distance.COSINE
                )
            )
    
    async def search(
        self,
        embedding: List[float],
        top_k: int = 5,
        score_threshold: float = 0.7
    ) -> List[dict]:
        results = await self.client.search(
            collection_name=self.collection_name,
            query_vector=embedding,
            limit=top_k,
            score_threshold=score_threshold
        )
        return [
            {"id": r.id, "score": r.score, "content": r.payload["content"]}
            for r in results
        ]`,

  pocCode: `# POC (Stage 2) - Single file app.py (~150 lines)
import streamlit as st
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma

# Everything in one file!
llm = ChatOpenAI(model="gpt-4o")
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
vectorstore = Chroma(embedding_function=embeddings)

# No error handling
# No configuration management
# No tests
# Manual deployment only

def main():
    st.title("Document Q&A")
    question = st.text_input("Ask a question")
    if question:
        docs = vectorstore.similarity_search(question)
        response = llm.invoke(f"Context: {docs}\\n\\nQuestion: {question}")
        st.write(response.content)`,
};

// Comparison data
const comparisonData = [
  { aspect: 'Files', poc: '1 file (~150 lines)', dev: '60+ files (~3000+ lines)' },
  { aspect: 'API', poc: 'Streamlit UI', dev: 'FastAPI REST API' },
  { aspect: 'Vector DB', poc: 'ChromaDB (in-memory)', dev: 'Qdrant (Docker)' },
  { aspect: 'LLM', poc: 'Single provider', dev: 'Gateway with fallbacks' },
  { aspect: 'Error Handling', poc: 'None', dev: 'Comprehensive + Circuit Breaker' },
  { aspect: 'Configuration', poc: 'Hardcoded', dev: 'Pydantic Settings + .env' },
  { aspect: 'Testing', poc: 'Manual only', dev: '150+ tests (unit/int/e2e/security)' },
  { aspect: 'Logging', poc: 'print()', dev: 'Structured JSON logging' },
  { aspect: 'Deployment', poc: 'streamlit run', dev: 'Docker + docker-compose' },
  { aspect: 'CI/CD', poc: 'None', dev: 'GitHub Actions (12 jobs)' },
  { aspect: 'Security Scanning', poc: 'None', dev: 'Bandit, Safety, pip-audit' },
  { aspect: 'Code Quality', poc: 'None', dev: 'Ruff, Black, MyPy, isort' },
  { aspect: 'Pre-commit', poc: 'None', dev: '10+ hooks configured' },
  { aspect: 'Prompts', poc: 'Inline strings', dev: 'Versioned template files' },
  { aspect: 'Documentation', poc: 'Minimal', dev: 'API docs + README' },
];

// API Endpoints
const apiEndpoints = [
  { method: 'GET', path: '/api/v1/health', desc: 'Health check with component status' },
  { method: 'GET', path: '/api/v1/health/live', desc: 'Kubernetes liveness probe' },
  { method: 'GET', path: '/api/v1/health/ready', desc: 'Kubernetes readiness probe' },
  { method: 'POST', path: '/api/v1/documents/upload', desc: 'Upload and process document' },
  { method: 'GET', path: '/api/v1/documents/stats', desc: 'Vector store statistics' },
  { method: 'DELETE', path: '/api/v1/documents/{id}', desc: 'Delete document' },
  { method: 'POST', path: '/api/v1/query', desc: 'Ask a question (RAG)' },
];

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCode, setExpandedCode] = useState({});

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'comparison', label: 'POC vs Dev', icon: GitBranch },
    { id: 'structure', label: 'File Structure', icon: Folder },
    { id: 'testing', label: 'Testing & QA', icon: TestTube },
    { id: 'code', label: 'Code Samples', icon: Code2 },
    { id: 'api', label: 'API Endpoints', icon: Server },
    { id: 'quickstart', label: 'Quick Start', icon: Rocket },
  ];

  const toggleCode = (key) => {
    setExpandedCode(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const CodeBlock = ({ filename, language, code }) => (
    <div className="code-block">
      <div className="code-header">
        <span className="code-filename">
          <FileCode size={16} />
          {filename}
        </span>
        <span className="code-lang">{language}</span>
      </div>
      <div className="code-content">
        <pre>{code}</pre>
      </div>
    </div>
  );

  const Collapsible = ({ title, icon: Icon, children, id }) => (
    <div className="collapsible">
      <div 
        className={`collapsible-header ${expandedCode[id] ? 'open' : ''}`}
        onClick={() => toggleCode(id)}
      >
        <span className="collapsible-title">
          <Icon size={20} />
          {title}
        </span>
        {expandedCode[id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>
      <div className={`collapsible-content ${expandedCode[id] ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="stage-badge">
            <Code2 size={16} />
            Stage 3 of 5
          </div>
          <h1>Development Environment</h1>
          <p>Production-ready RAG application with clean architecture, testing, and deployment infrastructure</p>
        </motion.div>
      </header>

      {/* Navigation */}
      <nav className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">60+</div>
                  <div className="stat-label">Files Created</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">3000+</div>
                  <div className="stat-label">Lines of Code</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">7</div>
                  <div className="stat-label">API Endpoints</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">150+</div>
                  <div className="stat-label">Tests</div>
                </div>
              </div>

              {/* Architecture */}
              <section className="section">
                <h2 className="section-title">
                  <Cpu size={24} />
                  Architecture Overview
                </h2>
                <div className="architecture-diagram">
                  <div className="arch-flow">
                    <div className="arch-box">
                      <h4>👤 Client</h4>
                      <p>REST API</p>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-box highlight">
                      <h4>🚀 FastAPI</h4>
                      <p>Port 8000</p>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-box">
                      <h4>🧠 Query Engine</h4>
                      <p>RAG Pipeline</p>
                    </div>
                    <span className="arch-arrow">→</span>
                    <div className="arch-box highlight">
                      <h4>🔍 Qdrant</h4>
                      <p>Port 6333</p>
                    </div>
                  </div>
                  <div className="arch-flow">
                    <div className="arch-box" style={{ opacity: 0 }}>spacer</div>
                    <span className="arch-arrow" style={{ opacity: 0 }}>→</span>
                    <div className="arch-box" style={{ opacity: 0 }}>spacer</div>
                    <span className="arch-arrow">↓</span>
                    <div className="arch-box highlight">
                      <h4>🤖 LLM Gateway</h4>
                      <p>GPT-4o + Fallback</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Key Features */}
              <section className="section">
                <h2 className="section-title">
                  <Zap size={24} />
                  Key Features
                </h2>
                <div className="cards-grid">
                  <div className="card">
                    <div className="card-icon blue"><Server size={24} /></div>
                    <h3>FastAPI REST API</h3>
                    <p>Async API with automatic OpenAPI docs, request validation, and middleware support</p>
                  </div>
                  <div className="card">
                    <div className="card-icon purple"><Cpu size={24} /></div>
                    <h3>GPT-4o + Fallback</h3>
                    <p>OpenAI as primary with optional Anthropic fallback via circuit breaker pattern</p>
                  </div>
                  <div className="card">
                    <div className="card-icon green"><Database size={24} /></div>
                    <h3>Qdrant Vector Store</h3>
                    <p>Production-ready vector database running in Docker with persistence</p>
                  </div>
                  <div className="card">
                    <div className="card-icon orange"><Settings size={24} /></div>
                    <h3>Pydantic Settings</h3>
                    <p>Type-safe configuration from environment variables with validation</p>
                  </div>
                  <div className="card">
                    <div className="card-icon cyan"><TestTube size={24} /></div>
                    <h3>150+ Automated Tests</h3>
                    <p>Unit, integration, E2E, and security tests with pytest and coverage</p>
                  </div>
                  <div className="card">
                    <div className="card-icon red"><Shield size={24} /></div>
                    <h3>Security Scanning</h3>
                    <p>Bandit, Safety, pip-audit, and detect-secrets for comprehensive security</p>
                  </div>
                  <div className="card">
                    <div className="card-icon pink"><Box size={24} /></div>
                    <h3>Docker Ready</h3>
                    <p>Multi-stage Dockerfile and docker-compose for easy deployment</p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Comparison Tab */}
          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <h2 className="section-title">
                  <GitBranch size={24} />
                  POC (Stage 2) vs Development (Stage 3)
                </h2>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Aspect</th>
                      <th><span className="poc-badge">POC</span> Stage 2</th>
                      <th><span className="dev-badge">DEV</span> Stage 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <tr key={i}>
                        <td>{row.aspect}</td>
                        <td>{row.poc}</td>
                        <td>{row.dev}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="section">
                <h2 className="section-title">
                  <Code2 size={24} />
                  Code Comparison
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: '#f59e0b' }}>❌ POC Approach</h3>
                    <CodeBlock 
                      filename="poc/app.py" 
                      language="Python"
                      code={codeSamples.pocCode}
                    />
                  </div>
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>✅ Development Approach</h3>
                    <CodeBlock 
                      filename="src/core/query_engine.py" 
                      language="Python"
                      code={codeSamples.queryEngine}
                    />
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* File Structure Tab */}
          {activeTab === 'structure' && (
            <motion.div
              key="structure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <h2 className="section-title">
                  <Folder size={24} />
                  Project Structure (60+ files)
                </h2>
                <div className="file-tree">
                  {fileTree.map((item, i) => (
                    <div 
                      key={i} 
                      className={`file-tree-item ${item.type} indent-${item.indent}`}
                    >
                      {item.type === 'folder' ? (
                        <Folder size={14} />
                      ) : (
                        <FileText size={14} />
                      )}
                      <span>{item.name}</span>
                      {item.desc && (
                        <span style={{ color: '#606070', marginLeft: '1rem', fontSize: '0.75rem' }}>
                          — {item.desc}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <h2 className="section-title">
                  <Layers size={24} />
                  Module Responsibilities
                </h2>
                <div className="cards-grid">
                  <div className="card">
                    <div className="card-icon blue"><Server size={24} /></div>
                    <h3>src/api/</h3>
                    <p>FastAPI routes, middleware (logging, error handling), and dependencies</p>
                  </div>
                  <div className="card">
                    <div className="card-icon purple"><Cpu size={24} /></div>
                    <h3>src/core/</h3>
                    <p>Business logic, query engine, orchestrator, and custom exceptions</p>
                  </div>
                  <div className="card">
                    <div className="card-icon green"><FileText size={24} /></div>
                    <h3>src/ingestion/</h3>
                    <p>Document loading, text chunking, and processing pipeline</p>
                  </div>
                  <div className="card">
                    <div className="card-icon orange"><Database size={24} /></div>
                    <h3>src/retrieval/</h3>
                    <p>OpenAI embeddings and Qdrant vector store operations</p>
                  </div>
                  <div className="card">
                    <div className="card-icon cyan"><Cpu size={24} /></div>
                    <h3>src/llm/</h3>
                    <p>LLM gateway with circuit breaker, OpenAI and Anthropic providers</p>
                  </div>
                  <div className="card">
                    <div className="card-icon pink"><FileCode size={24} /></div>
                    <h3>src/prompts/</h3>
                    <p>Versioned prompt templates with Jinja2 rendering</p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Testing & QA Tab */}
          {activeTab === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Test Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">150+</div>
                  <div className="stat-label">Total Tests</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">90+</div>
                  <div className="stat-label">Unit Tests</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">20+</div>
                  <div className="stat-label">Integration Tests</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">12</div>
                  <div className="stat-label">CI/CD Jobs</div>
                </div>
              </div>

              {/* Test Categories */}
              <section className="section">
                <h2 className="section-title">
                  <TestTube size={24} />
                  Test Categories
                </h2>
                <div className="cards-grid">
                  <div className="card">
                    <div className="card-icon blue"><CheckCircle size={24} /></div>
                    <h3>Unit Tests (90+)</h3>
                    <p>Loader, Chunker, Embeddings, Vector Store, Query Engine, LLM Gateway, Orchestrator, Settings, Models, Prompts</p>
                  </div>
                  <div className="card">
                    <div className="card-icon green"><Server size={24} /></div>
                    <h3>Integration Tests (20+)</h3>
                    <p>Document API, Query API, Health endpoints, Full API flow testing</p>
                  </div>
                  <div className="card">
                    <div className="card-icon purple"><Rocket size={24} /></div>
                    <h3>E2E Tests (12)</h3>
                    <p>Document workflows, Query workflows, Performance tests, Resilience tests</p>
                  </div>
                  <div className="card">
                    <div className="card-icon red"><Lock size={24} /></div>
                    <h3>Security Tests (20+)</h3>
                    <p>SQL injection, XSS, Path traversal, Auth bypass, Rate limiting, CORS</p>
                  </div>
                </div>
              </section>

              {/* Quality Tools */}
              <section className="section">
                <h2 className="section-title">
                  <Shield size={24} />
                  Quality & Security Tools
                </h2>
                <div className="endpoint-list">
                  <div className="endpoint-item">
                    <span className="endpoint-method get">LINT</span>
                    <span className="endpoint-path">Ruff</span>
                    <span className="endpoint-desc">Fast Python linter with 500+ rules</span>
                  </div>
                  <div className="endpoint-item">
                    <span className="endpoint-method post">FORMAT</span>
                    <span className="endpoint-path">Black + isort</span>
                    <span className="endpoint-desc">Code formatting and import sorting</span>
                  </div>
                  <div className="endpoint-item">
                    <span className="endpoint-method get">TYPE</span>
                    <span className="endpoint-path">MyPy</span>
                    <span className="endpoint-desc">Static type checking</span>
                  </div>
                  <div className="endpoint-item">
                    <span className="endpoint-method delete">SECURITY</span>
                    <span className="endpoint-path">Bandit</span>
                    <span className="endpoint-desc">Security vulnerability scanning</span>
                  </div>
                  <div className="endpoint-item">
                    <span className="endpoint-method delete">DEPS</span>
                    <span className="endpoint-path">Safety + pip-audit</span>
                    <span className="endpoint-desc">Dependency vulnerability checks</span>
                  </div>
                  <div className="endpoint-item">
                    <span className="endpoint-method delete">SECRETS</span>
                    <span className="endpoint-path">detect-secrets</span>
                    <span className="endpoint-desc">Prevent secrets from being committed</span>
                  </div>
                </div>
              </section>

              {/* Make Commands */}
              <section className="section">
                <h2 className="section-title">
                  <Terminal size={24} />
                  Testing Commands
                </h2>
                <CodeBlock 
                  filename="Testing with Make" 
                  language="bash"
                  code={`# Run all tests
make test

# Run by category
make test-unit       # Unit tests only
make test-int        # Integration tests only
make test-e2e        # E2E tests only
make test-security   # Security tests only

# Run with coverage
make coverage

# Quality checks
make lint            # Run Ruff linter
make format          # Format with Black & isort
make type-check      # Run MyPy
make security        # Run security scans
make quality         # Run ALL quality checks

# CI simulation
make ci              # Run full CI pipeline locally`}
                />
              </section>

              {/* CI/CD Pipeline */}
              <section className="section">
                <h2 className="section-title">
                  <GitBranch size={24} />
                  CI/CD Pipeline (12 Jobs)
                </h2>
                <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>Quality</h4>
                    <small>Ruff, Black, isort</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>Type Check</h4>
                    <small>MyPy</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>Security</h4>
                    <small>Bandit, Safety</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>Unit Tests</h4>
                    <small>+ Coverage</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>Integration</h4>
                    <small>API tests</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>E2E</h4>
                    <small>Full workflows</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>Security Tests</h4>
                    <small>Vulnerability</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>SonarQube</h4>
                    <small>Code quality</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>Docker Build</h4>
                    <small>Image test</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>Docs</h4>
                    <small>Docstring check</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>License</h4>
                    <small>Compliance</small>
                  </div>
                  <div className="card" style={{ padding: '1rem' }}>
                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                    <h4 style={{ margin: '0.5rem 0' }}>Performance</h4>
                    <small>Benchmarks</small>
                  </div>
                </div>
              </section>

              {/* Pre-commit */}
              <section className="section">
                <h2 className="section-title">
                  <Settings size={24} />
                  Pre-commit Hooks (10+)
                </h2>
                <CodeBlock 
                  filename=".pre-commit-config.yaml hooks" 
                  language="yaml"
                  code={`# Install hooks
make pre-commit

# Hooks include:
- trailing-whitespace    # Remove trailing spaces
- end-of-file-fixer      # Fix EOF
- check-yaml/json/toml   # Syntax validation
- check-large-files      # Prevent large commits
- detect-private-key     # Block private keys
- black                  # Code formatting
- isort                  # Import sorting
- ruff                   # Linting
- mypy                   # Type checking
- bandit                 # Security scanning
- detect-secrets         # Secrets detection
- commitizen             # Commit message format`}
                />
              </section>
            </motion.div>
          )}

          {/* Code Samples Tab */}
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <h2 className="section-title">
                  <Code2 size={24} />
                  Key Code Files
                </h2>

                <Collapsible title="Configuration Management" icon={Settings} id="settings">
                  <CodeBlock 
                    filename="config/settings.py" 
                    language="Python"
                    code={codeSamples.settings}
                  />
                </Collapsible>

                <Collapsible title="FastAPI Application" icon={Server} id="fastapi">
                  <CodeBlock 
                    filename="src/api/main.py" 
                    language="Python"
                    code={codeSamples.fastapi}
                  />
                </Collapsible>

                <Collapsible title="Query Engine (RAG Pipeline)" icon={Cpu} id="query">
                  <CodeBlock 
                    filename="src/core/query_engine.py" 
                    language="Python"
                    code={codeSamples.queryEngine}
                  />
                </Collapsible>

                <Collapsible title="LLM Gateway with Fallbacks" icon={Shield} id="llm">
                  <CodeBlock 
                    filename="src/llm/gateway.py" 
                    language="Python"
                    code={codeSamples.llmGateway}
                  />
                </Collapsible>

                <Collapsible title="Qdrant Vector Store" icon={Database} id="vector">
                  <CodeBlock 
                    filename="src/retrieval/vector_store.py" 
                    language="Python"
                    code={codeSamples.vectorStore}
                  />
                </Collapsible>
              </section>
            </motion.div>
          )}

          {/* API Endpoints Tab */}
          {activeTab === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <h2 className="section-title">
                  <Server size={24} />
                  REST API Endpoints
                </h2>
                <div className="endpoint-list">
                  {apiEndpoints.map((endpoint, i) => (
                    <div key={i} className="endpoint-item">
                      <span className={`endpoint-method ${endpoint.method.toLowerCase()}`}>
                        {endpoint.method}
                      </span>
                      <span className="endpoint-path">{endpoint.path}</span>
                      <span className="endpoint-desc">{endpoint.desc}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <h2 className="section-title">
                  <Terminal size={24} />
                  Example API Calls
                </h2>
                <CodeBlock 
                  filename="API Examples" 
                  language="bash"
                  code={`# Health check
curl http://localhost:8000/api/v1/health

# Ask a question
curl -X POST http://localhost:8000/api/v1/query \\
  -H "Content-Type: application/json" \\
  -d '{"question": "What is the remote work policy?"}'

# Upload a document (base64 encoded)
curl -X POST http://localhost:8000/api/v1/documents/upload \\
  -H "Content-Type: application/json" \\
  -d '{
    "filename": "policy.md",
    "content": "SGVsbG8gV29ybGQh",
    "file_type": "markdown"
  }'

# Get vector store stats
curl http://localhost:8000/api/v1/documents/stats`}
                />
              </section>
            </motion.div>
          )}

          {/* Quick Start Tab */}
          {activeTab === 'quickstart' && (
            <motion.div
              key="quickstart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <div className="quick-start">
                  <h3>
                    <Rocket size={24} />
                    Quick Start Guide
                  </h3>
                  <div className="step-list">
                    <div className="step-item">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h4>Navigate to project</h4>
                        <code>cd docuquery</code>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h4>Create virtual environment</h4>
                        <code>python -m venv venv && source venv/bin/activate</code>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h4>Install dependencies</h4>
                        <code>pip install -r requirements.txt</code>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <h4>Setup environment variables</h4>
                        <code>cp .env.example .env && nano .env  # Add OPENAI_API_KEY</code>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">5</div>
                      <div className="step-content">
                        <h4>Start Qdrant (in another terminal)</h4>
                        <code>docker run -p 6333:6333 qdrant/qdrant</code>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">6</div>
                      <div className="step-content">
                        <h4>Run the API</h4>
                        <code>uvicorn src.api.main:app --reload</code>
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">7</div>
                      <div className="step-content">
                        <h4>Open API docs</h4>
                        <code>open http://localhost:8000/docs</code>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section">
                <h2 className="section-title">
                  <Terminal size={24} />
                  All Make Commands
                </h2>
                <CodeBlock 
                  filename="Makefile commands" 
                  language="bash"
                  code={`# === Setup ===
make install        # Install production deps
make install-dev    # Install dev dependencies
make pre-commit     # Install pre-commit hooks

# === Running ===
make run            # Run FastAPI (port 8000)
make dev            # Run FastAPI with auto-reload
make streamlit      # Run Streamlit UI (port 8501)

# === Testing ===
make test           # Run all tests
make test-unit      # Unit tests only
make test-int       # Integration tests
make test-e2e       # E2E tests
make test-security  # Security tests
make coverage       # Tests with coverage report

# === Quality ===
make lint           # Run Ruff linter
make format         # Format with Black & isort
make type-check     # Run MyPy
make security       # Security scans
make quality        # ALL quality checks

# === Docker ===
make docker-build   # Build image
make docker-up      # Start services
make docker-down    # Stop services
make qdrant         # Start Qdrant only

# === Other ===
make clean          # Clean cache files
make ci             # Simulate full CI
make help           # Show all commands`}
                />
              </section>

              <section className="section">
                <h2 className="section-title">
                  <Box size={24} />
                  Using Docker Compose
                </h2>
                <CodeBlock 
                  filename="Docker commands" 
                  language="bash"
                  code={`# Start everything (app + Qdrant)
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Stop everything
docker-compose -f docker/docker-compose.yml down`}
                />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)'
      }}>
        <p>Stage 3: Development Environment | DocuQuery - AI-Powered Document Q&A</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Next: Stage 4 - Staging Environment (Observability, Evaluation, Security)
        </p>
      </footer>
    </div>
  );
}

export default App;
