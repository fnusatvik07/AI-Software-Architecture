# DocuQuery - AI-Powered Document Q&A

> **Stage 4: Staging Environment** - Production-ready RAG with Kubernetes, Helm, and observability (Prometheus, Grafana, Loki).

A production-ready RAG (Retrieval-Augmented Generation) application for document Q&A using **OpenAI GPT-4o**.

## 🌟 Features

- 🚀 **FastAPI REST API** - High-performance async API with OpenAPI docs
- 🧠 **GPT-4o** - State-of-the-art LLM for answer generation
- 🔍 **Qdrant Vector Store** - Fast similarity search (in-memory for dev)
- 📄 **Multi-format Support** - PDF, Markdown, Text, HTML
- 🎨 **Streamlit UI** - Interactive development interface
- ⚛️ **React Showcase** - Modern frontend demo
- 🔒 **Production Ready** - Error handling, logging, health checks
- 🐳 **Docker Support** - Easy deployment with docker-compose
- ✅ **150+ Tests** - Unit, integration, E2E, and security tests
- 🔐 **Security Scanning** - Bandit, Safety, pip-audit
- 📊 **SonarQube Ready** - Code quality analysis

### Stage 4 - Staging Infrastructure

- ☸️ **Kubernetes Manifests** - Full K8s deployment configs
- ⎈ **Helm Chart** - Templated deployment with values
- 📈 **Prometheus** - Metrics collection and alerting
- 📊 **Grafana Dashboards** - API and system monitoring
- 📝 **Logging Stack** - Loki + Promtail + FluentBit
- 🔄 **HPA** - Auto-scaling based on CPU/memory
- 🛡️ **RBAC & Network Policies** - Security configurations

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- OpenAI API Key
- Node.js 20+ (for React UI, optional)
- Docker (optional, for production setup)

### Installation

```bash
# From the root directory (architecture/)

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install production dependencies
make install

# Install dev dependencies (testing, linting, formatting tools)
make install-dev

# Setup environment
cp docuquery/.env.example docuquery/.env
# Edit docuquery/.env with your OPENAI_API_KEY
```

---

## 📋 Make Commands

All development tasks are available via `make` commands. **Run from the root `architecture/` directory:**

### Setup Commands
```bash
make install        # Install production dependencies
make install-dev    # Install dev dependencies (testing, linting, etc.)
make pre-commit     # Install pre-commit hooks
```

### Running Applications
```bash
make run              # Run FastAPI server (production mode)
make dev              # Run FastAPI with auto-reload (development)
make streamlit        # Run Streamlit UI on port 8501
make infra-dashboard  # Run Infrastructure Dashboard on port 8502
make frontend         # Run React frontend on port 5173
```

### Code Quality
```bash
make lint           # Run Ruff linter
make format         # Format code with Black & isort
make format-check   # Check formatting without changes
make type-check     # Run MyPy type checker
make security       # Run security scans (Bandit, Safety, pip-audit)
make quality        # Run ALL quality checks
```

### Testing
```bash
make test           # Run all tests
make test-unit      # Run unit tests only
make test-int       # Run integration tests only
make test-e2e       # Run E2E tests only
make test-security  # Run security tests only
make test-all       # Run all test categories sequentially
make coverage       # Run tests with coverage report
```

### Docker
```bash
make docker-build   # Build Docker image
make docker-run     # Run Docker container
make docker-up      # Start with docker-compose
make docker-down    # Stop docker-compose
make qdrant         # Start Qdrant only (standalone)
```

### Other
```bash
make clean          # Clean up cache and generated files
make sonar          # Run SonarQube analysis
make ci             # Simulate full CI pipeline locally
make help           # Show all available commands
```

---

## 🖥️ Running the Applications

> **Note:** All `make` commands run from the root `architecture/` directory.

### 1. FastAPI Backend (Port 8000)

```bash
# Development mode with auto-reload
make dev

# OR directly (from docuquery/)
cd docuquery && uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

**API Documentation**: http://localhost:8000/docs

### 2. Streamlit UI (Port 8501)

```bash
# Using make (from root)
make streamlit

# OR directly (from docuquery/)
cd docuquery && streamlit run streamlit_app.py --server.port 8501
```

**Streamlit App**: http://localhost:8501

Features:
- 📤 Document upload with chunking & embedding
- 🔍 Interactive Q&A with source citations
- 📊 Document management & statistics
- 🗑️ Delete documents
- 📝 Detailed logging

### 3. React Showcase UI (Port 5173)

```bash
# Using make (from root)
make frontend

# OR directly
cd docuquery/frontend && npm install && npm run dev
```

**React App**: http://localhost:5173

---

## 🧪 Testing

### Test Structure (150+ tests)

```
tests/
├── unit/                    # 90+ unit tests
│   ├── test_loader.py       # Document loader tests
│   ├── test_chunker.py      # Text chunking tests
│   ├── test_embeddings.py   # Embedding service tests
│   ├── test_vector_store.py # Vector store tests
│   ├── test_query_engine.py # Query engine tests
│   ├── test_llm_gateway.py  # LLM gateway tests
│   ├── test_orchestrator.py # Orchestrator tests
│   ├── test_settings.py     # Configuration tests
│   ├── test_models.py       # Data model tests
│   └── test_prompt_manager.py # Prompt manager tests
├── integration/             # 20+ integration tests
│   ├── test_documents.py    # Document API tests
│   ├── test_query.py        # Query API tests
│   ├── test_health.py       # Health endpoint tests
│   └── test_api.py          # General API tests
├── e2e/                     # 12 E2E tests
│   └── test_e2e.py          # Full workflow tests
└── security/                # 20+ security tests
    └── test_security.py     # Security validation tests
```

### Running Tests

```bash
# All tests (from root directory)
make test

# Specific category
make test-unit
make test-int
make test-e2e
make test-security

# With coverage
make coverage

# OR using pytest directly (from docuquery/)
cd docuquery && python -m pytest tests/ -v
```

### Test Categories

| Category | Tests | Description |
|----------|-------|-------------|
| Unit | 90+ | Individual component testing |
| Integration | 20+ | API endpoint testing |
| E2E | 12 | Full workflow testing |
| Security | 20+ | Security validation |

---

## 🔒 Quality & Security Checks

### Pre-commit Hooks

```bash
# Install hooks (from root)
make pre-commit

# Run manually (from docuquery/)
cd docuquery && pre-commit run --all-files
```

**Hooks included:**
- Black (formatting)
- isort (import sorting)
- Ruff (linting)
- MyPy (type checking)
- Bandit (security)
- detect-secrets (secrets detection)
- commitizen (commit messages)

### Security Scanning

```bash
# Run all security checks (from root)
make security

# Individual tools (from docuquery/)
cd docuquery
bandit -r src/ -f txt          # Security linting
safety check -r requirements.txt  # Dependency vulnerabilities
pip-audit -r requirements.txt     # Package auditing
```

### SonarQube Analysis

```bash
# Run SonarQube (from root, requires SONAR_TOKEN)
make sonar
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/health` | GET | Health check |
| `/api/v1/health/live` | GET | Liveness probe |
| `/api/v1/health/ready` | GET | Readiness probe |
| `/api/v1/documents/upload` | POST | Upload document |
| `/api/v1/documents/stats` | GET | Get statistics |
| `/api/v1/documents/{id}` | DELETE | Delete document |
| `/api/v1/query` | POST | Ask a question |

### Example API Calls

```bash
# Health check
curl http://localhost:8000/api/v1/health

# Upload a document
curl -X POST http://localhost:8000/api/v1/documents/upload \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "info.txt",
    "content": "Python was created by Guido van Rossum in 1991.",
    "file_type": "text"
  }'

# Ask a question
curl -X POST http://localhost:8000/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Who created Python?"}'

# Get document stats
curl http://localhost:8000/api/v1/documents/stats

# Delete a document
curl -X DELETE http://localhost:8000/api/v1/documents/{document_id}
```

---

## 🏗️ Project Structure

```
docuquery/
├── src/
│   ├── api/              # FastAPI routes & middleware
│   │   ├── main.py       # Application entry point
│   │   ├── routes/       # API route handlers
│   │   └── middleware/   # Custom middleware
│   ├── core/             # Business logic & orchestration
│   │   ├── orchestrator.py
│   │   └── query_engine.py
│   ├── ingestion/        # Document processing
│   │   ├── loader.py     # Document loading
│   │   └── chunker.py    # Text chunking
│   ├── retrieval/        # Vector search & embeddings
│   │   ├── vector_store.py
│   │   └── embeddings.py
│   ├── llm/              # LLM providers & gateway
│   │   └── gateway.py
│   ├── prompts/          # Prompt templates
│   │   └── manager.py
│   └── models/           # Pydantic data models
├── tests/                # Test suites
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── security/
├── config/               # Configuration
│   └── settings.py
├── docker/               # Docker files
│   ├── Dockerfile
│   └── docker-compose.yml
├── frontend/             # React showcase UI
├── streamlit_app.py      # Streamlit dev UI
├── .github/workflows/    # CI/CD pipelines
├── .pre-commit-config.yaml
├── sonar-project.properties
├── Makefile
├── pyproject.toml
├── requirements.txt
└── requirements-dev.txt
```

---

## ⚙️ Configuration

Environment variables (`.env` file):

```env
# Required
OPENAI_API_KEY=sk-...

# LLM Settings
LLM_MODEL=gpt-4o
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=1000

# Embedding Settings
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSIONS=3072

# Vector Store
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_IN_MEMORY=true

# Retrieval
RETRIEVAL_TOP_K=5
RETRIEVAL_SCORE_THRESHOLD=0.3

# Chunking
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

# Server
API_HOST=0.0.0.0
API_PORT=8000
```

---

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline includes:

| Job | Description |
|-----|-------------|
| **quality** | Ruff, Black, isort checks |
| **type-check** | MyPy type checking |
| **security** | Bandit, Safety, pip-audit |
| **unit-tests** | Unit tests with coverage |
| **integration-tests** | Integration tests |
| **e2e-tests** | End-to-end tests |
| **security-tests** | Security test suite |
| **sonarqube** | SonarQube analysis |
| **docker-build** | Docker image build test |
| **docs** | Documentation checks |
| **license-check** | License compliance |
| **performance-tests** | Performance benchmarks |

---

## 🏛️ Architecture

```
┌─────────────┐     ┌─────────────────────────────────────────┐
│   Client    │     │              DocuQuery                   │
│  (Browser)  │────▶│  ┌──────────────────────────────────┐   │
└─────────────┘     │  │           FastAPI                 │   │
                    │  │  ┌─────────────────────────────┐  │   │
                    │  │  │      Query Engine           │  │   │
                    │  │  │  ┌──────────┐ ┌──────────┐  │  │   │
                    │  │  │  │ Retrieval│ │ LLM      │  │  │   │
                    │  │  │  │ Layer    │ │ Gateway  │  │  │   │
                    │  │  │  └────┬─────┘ └────┬─────┘  │  │   │
                    │  │  └───────┼────────────┼────────┘  │   │
                    │  └──────────┼────────────┼───────────┘   │
                    └─────────────┼────────────┼───────────────┘
                                  │            │
                    ┌─────────────▼──┐    ┌────▼────────┐
                    │    Qdrant      │    │   OpenAI    │
                    │  Vector Store  │    │   GPT-4o    │
                    └────────────────┘    └─────────────┘
```

---

## 📝 Development Workflow

All commands run from the root `architecture/` directory:

1. **Setup**: `make install-dev && make pre-commit`
2. **Develop**: `make dev` (FastAPI) or `make streamlit` (UI)
3. **Test**: `make test-all`
4. **Quality**: `make quality`
5. **Commit**: Pre-commit hooks run automatically
6. **Push**: CI/CD pipeline validates everything

---

## ☸️ Staging Infrastructure (Stage 4)

### Kubernetes Deployment

The `k8s/` directory contains production-ready Kubernetes manifests:

```
docuquery/k8s/
├── base/                      # Base manifests
│   ├── namespace.yaml         # Namespace definition
│   ├── deployment.yaml        # Main deployment
│   ├── service.yaml           # ClusterIP service
│   ├── ingress.yaml           # Ingress with TLS
│   ├── configmap.yaml         # Application config
│   ├── secrets.yaml           # Sensitive data
│   ├── hpa.yaml               # Horizontal Pod Autoscaler
│   ├── pdb.yaml               # Pod Disruption Budget
│   ├── rbac.yaml              # Service account & roles
│   ├── network-policy.yaml    # Network restrictions
│   └── kustomization.yaml     # Kustomize config
└── overlays/
    └── staging/               # Staging-specific overrides
        └── kustomization.yaml
```

**Deploy to staging:**
```bash
kubectl apply -k docuquery/k8s/overlays/staging
```

### Helm Chart

The `helm/` directory contains a templated Helm chart:

```
docuquery/helm/docuquery/
├── Chart.yaml                 # Chart metadata
├── values.yaml                # Default values
└── templates/
    ├── _helpers.tpl           # Template helpers
    ├── deployment.yaml        # Deployment template
    ├── service.yaml           # Service template
    ├── ingress.yaml           # Ingress template
    ├── configmap.yaml         # ConfigMap template
    ├── secrets.yaml           # Secrets template
    ├── hpa.yaml               # HPA template
    ├── pdb.yaml               # PDB template
    └── servicemonitor.yaml    # Prometheus ServiceMonitor
```

**Install with Helm:**
```bash
helm install docuquery ./docuquery/helm/docuquery \
  --namespace docuquery \
  --create-namespace \
  --set secrets.openaiApiKey=$OPENAI_API_KEY
```

### Monitoring Stack

**Prometheus** (`monitoring/prometheus/`):
- Metrics scraping configuration
- Alert rules for errors, latency, resources

**Grafana** (`monitoring/grafana/`):
- API performance dashboard
- System metrics dashboard
- Datasource provisioning

**View Infrastructure Dashboard:**
```bash
make infra-dashboard   # Opens on port 8502
```

### Logging Stack

**Loki** (`logging/loki/`):
- Log aggregation and querying
- 30-day retention configured

**Promtail/FluentBit** (`logging/promtail/`, `logging/fluentbit/`):
- Log collection agents
- Kubernetes and application log parsing

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

- OpenAI for GPT-4o
- Qdrant for vector database
- FastAPI for the web framework
- Streamlit for the dev UI
