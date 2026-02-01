# AI Software Architecture Workshop

> A comprehensive workshop demonstrating the complete lifecycle of building production-ready AI applications — from initial concept to enterprise deployment.

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-blue?style=flat-square&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-0.104+-green?style=flat-square&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-purple?style=flat-square&logo=openai" alt="OpenAI">
  <img src="https://img.shields.io/badge/Kubernetes-1.28+-blue?style=flat-square&logo=kubernetes" alt="Kubernetes">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## Overview

This repository showcases **DocuQuery**, a production-grade RAG (Retrieval-Augmented Generation) application for intelligent document Q&A. The project is structured across 5 progressive stages, each representing a critical phase in the AI software development lifecycle.

**DocuQuery** allows users to upload documents (PDF, Markdown, Text, HTML), automatically chunks and embeds them using sentence transformers, stores vectors in Qdrant, and answers questions using GPT-4o with retrieved context.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DocuQuery Architecture                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────────┐ │
│  │   Clients    │     │   Ingress    │     │      Load Balancer           │ │
│  │  (Web/API)   │────▶│   (NGINX)    │────▶│   (Blue/Green Traffic)       │ │
│  └──────────────┘     └──────────────┘     └──────────────────────────────┘ │
│                                                       │                      │
│                              ┌────────────────────────┴────────────────┐    │
│                              ▼                                         ▼    │
│                    ┌──────────────────┐                    ┌──────────────┐ │
│                    │   Blue Deploy    │                    │ Green Deploy │ │
│                    │   (Active)       │                    │  (Preview)   │ │
│                    └────────┬─────────┘                    └──────────────┘ │
│                              │                                               │
│  ┌───────────────────────────┼───────────────────────────────────────────┐  │
│  │                           ▼                                           │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                      FastAPI Application                        │  │  │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │  │  │
│  │  │  │  Document   │  │   Query     │  │      Answer Generation  │  │  │  │
│  │  │  │  Ingestion  │  │  Processing │  │         (GPT-4o)        │  │  │  │
│  │  │  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────┘  │  │  │
│  │  │         │                │                      │               │  │  │
│  │  │         ▼                ▼                      ▼               │  │  │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │  │  │
│  │  │  │              Embedding Service (MiniLM-L6)              │   │  │  │
│  │  │  └─────────────────────────┬───────────────────────────────┘   │  │  │
│  │  └────────────────────────────┼───────────────────────────────────┘  │  │
│  │                               │                                      │  │
│  │                               ▼                                      │  │
│  │                    ┌──────────────────┐                              │  │
│  │                    │  Qdrant Vector   │                              │  │
│  │                    │    Database      │                              │  │
│  │                    │  (3 replicas)    │                              │  │
│  │                    └──────────────────┘                              │  │
│  │                                                                      │  │
│  │  ┌────────────────────────────────────────────────────────────────┐ │  │
│  │  │                    Observability Stack                         │ │  │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐  │ │  │
│  │  │  │ Prometheus │  │  Grafana   │  │    Loki    │  │ Promtail │  │ │  │
│  │  │  │  Metrics   │  │ Dashboards │  │    Logs    │  │ Collector│  │ │  │
│  │  │  └────────────┘  └────────────┘  └────────────┘  └──────────┘  │ │  │
│  │  └────────────────────────────────────────────────────────────────┘ │  │
│  │                         Kubernetes Cluster                          │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Development Stages

This workshop follows a progressive 5-stage approach, with each stage building on the previous:

| Stage | Branch | Description | Key Components |
|-------|--------|-------------|----------------|
| **1** | `stage1-ideation` | Concept & Planning | Requirements, user stories, architecture decisions |
| **2** | `stage2-poc` | Proof of Concept | Core RAG pipeline, basic FastAPI, initial tests |
| **3** | `stage3-development` | Full Development | Complete API, 150+ tests, Docker, CI/CD, React UI |
| **4** | `stage4-staging` | Staging Environment | Kubernetes, Helm charts, Prometheus, Grafana, Loki |
| **5** | `stage5-production` | Production Deployment | Blue/Green, SLO monitoring, HA, security hardening |

### Stage Progression Diagram

```
Stage 1          Stage 2          Stage 3          Stage 4          Stage 5
Ideation    ──▶  POC         ──▶  Development ──▶  Staging     ──▶  Production
                                                                    
┌─────────┐     ┌─────────┐      ┌─────────┐     ┌─────────┐      ┌─────────┐
│ Ideas   │     │ Basic   │      │ Full    │     │ K8s     │      │ Blue/   │
│ Arch    │     │ RAG     │      │ API     │     │ Helm    │      │ Green   │
│ Docs    │     │ Tests   │      │ 150+    │     │ Prom    │      │ SLOs    │
│         │     │         │      │ Tests   │     │ Grafana │      │ HA      │
└─────────┘     └─────────┘      └─────────┘     └─────────┘      └─────────┘
```

---

## Tech Stack

### Application Layer
| Component | Technology | Purpose |
|-----------|------------|---------|
| Backend API | FastAPI | High-performance async REST API |
| LLM | OpenAI GPT-4o | Answer generation with context |
| Embeddings | sentence-transformers (MiniLM-L6) | Document and query vectorization |
| Vector Store | Qdrant | Similarity search and retrieval |
| Dev UI | Streamlit | Interactive development interface |
| Showcase UI | React + Vite | Modern frontend demonstration |

### Infrastructure Layer
| Component | Technology | Purpose |
|-----------|------------|---------|
| Container Orchestration | Kubernetes | Deployment, scaling, management |
| Package Management | Helm | Templated Kubernetes deployments |
| Metrics | Prometheus | Time-series metrics collection |
| Dashboards | Grafana | Visualization and alerting |
| Logging | Loki + Promtail | Centralized log aggregation |
| CI/CD | GitHub Actions | Automated testing and deployment |

### Quality & Security
| Component | Technology | Purpose |
|-----------|------------|---------|
| Testing | pytest | Unit, integration, E2E, security tests |
| Linting | Ruff | Fast Python linting |
| Formatting | Black + isort | Code formatting |
| Type Checking | MyPy | Static type analysis |
| Security Scanning | Bandit, Safety, pip-audit | Vulnerability detection |
| Code Quality | SonarQube | Comprehensive code analysis |

---

## Project Structure

```
architecture/
├── main.py                    # Root entry point
├── pyproject.toml             # Python project configuration
├── Makefile                   # Development commands
│
└── docuquery/                 # Main application
    ├── src/
    │   ├── api/               # FastAPI application
    │   │   ├── main.py        # App entry point
    │   │   ├── routes/        # API endpoints
    │   │   ├── models/        # Pydantic schemas
    │   │   └── middleware/    # Error handling, logging
    │   │
    │   ├── core/              # Business logic
    │   │   ├── document_processor.py
    │   │   ├── embedding_service.py
    │   │   ├── vector_store.py
    │   │   └── qa_engine.py
    │   │
    │   └── utils/             # Utilities
    │       ├── config.py
    │       └── logging.py
    │
    ├── tests/                 # Test suite (150+ tests)
    │   ├── unit/
    │   ├── integration/
    │   ├── e2e/
    │   └── security/
    │
    ├── frontend/              # React showcase UI
    │   └── src/
    │       ├── App-Stage3.jsx # Development UI
    │       ├── App-Stage4.jsx # Staging UI
    │       └── App-Stage5.jsx # Production UI
    │
    ├── k8s/                   # Kubernetes manifests
    │   ├── base/              # Base resources
    │   ├── overlays/
    │   │   ├── staging/       # Staging configuration
    │   │   └── production/    # Production configuration
    │   └── blue-green/        # Blue/Green deployment
    │
    ├── helm/                  # Helm chart
    │   └── docuquery/
    │       ├── Chart.yaml
    │       ├── values.yaml
    │       ├── values-staging.yaml
    │       ├── values-production.yaml
    │       └── templates/
    │
    ├── monitoring/            # Observability
    │   ├── prometheus/
    │   │   ├── prometheus.yml
    │   │   ├── alerts.yml
    │   │   └── alerts-production.yml
    │   └── grafana/
    │       ├── dashboards/
    │       └── provisioning/
    │
    ├── logging/               # Log aggregation
    │   ├── loki/
    │   ├── promtail/
    │   └── fluentbit/
    │
    └── docker/                # Container configuration
        ├── Dockerfile
        └── docker-compose.yml
```

---

## Key Features by Stage

### Stage 3: Development Environment

**API Endpoints:**
- `POST /api/v1/documents/upload` - Upload and process documents
- `POST /api/v1/query` - Query documents with natural language
- `GET /api/v1/documents` - List all documents
- `DELETE /api/v1/documents/{id}` - Remove a document
- `GET /api/v1/health` - Health check with component status

**Quality Assurance:**
- 150+ tests with 80%+ code coverage
- Unit tests for all core components
- Integration tests for API endpoints
- E2E tests for complete workflows
- Security tests for vulnerabilities

### Stage 4: Staging Environment

**Kubernetes Resources:**
- Namespace isolation
- Deployment with 2-5 replicas
- Services (ClusterIP, LoadBalancer)
- Ingress with TLS termination
- ConfigMaps and Secrets
- HorizontalPodAutoscaler
- PodDisruptionBudget
- NetworkPolicy
- RBAC (ServiceAccount, Role, RoleBinding)

**Monitoring Stack:**
- Prometheus with 15s scrape interval
- Custom alert rules for errors, latency, resources
- Grafana dashboards for API and system metrics
- Loki for log aggregation
- Promtail/FluentBit for log collection

### Stage 5: Production Environment

**Blue/Green Deployment:**
```
Traffic Flow:
                    ┌─────────────────┐
  Ingress ────────▶ │ Active Service  │ ────▶ Blue (v1.4.2) ✓ 100% traffic
                    │                 │
                    │ Preview Service │ ────▶ Green (v1.5.0) ○ Testing only
                    └─────────────────┘

Switch Command: ./k8s/blue-green/switch.sh green
Rollback:       ./k8s/blue-green/switch.sh blue
```

**SLO Targets:**
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Availability | 99.9% | < 99.9% for 5 minutes |
| P95 Latency | < 200ms | > 200ms for 5 minutes |
| P99 Latency | < 500ms | > 500ms for 5 minutes |
| Error Rate | < 0.1% | > 0.1% for 2 minutes |

**Production Hardening:**
- Multi-zone topology spread
- Pod anti-affinity rules
- Strict network policies (default deny)
- Non-root containers with read-only filesystem
- Rate limiting (100 req/min per client)
- Security scanning in CI/CD pipeline

---

## Quick Start

### Prerequisites

- Python 3.11+
- OpenAI API Key
- Node.js 20+ (optional, for React UI)
- Docker (optional, for containerized deployment)
- kubectl + Helm (optional, for Kubernetes deployment)

### Local Development

```bash
# Clone and setup
git clone https://github.com/fnusatvik07/AI-Software-Architecture.git
cd AI-Software-Architecture

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
make install
make install-dev

# Configure environment
cp docuquery/.env.example docuquery/.env
# Edit .env with your OPENAI_API_KEY

# Run the application
make dev          # FastAPI on :8000
make streamlit    # Streamlit on :8501
make frontend     # React on :5173
```

### Running Tests

```bash
make test           # All tests
make test-unit      # Unit tests only
make test-int       # Integration tests
make test-e2e       # End-to-end tests
make test-security  # Security tests
make test-cov       # With coverage report
```

### Code Quality

```bash
make quality        # Run all checks
make lint           # Ruff linting
make format         # Black + isort formatting
make type-check     # MyPy type checking
make security       # Security scanning
```

---

## Deployment

### Staging (Kubernetes)

```bash
# Using Kustomize
kubectl apply -k docuquery/k8s/overlays/staging

# Using Helm
helm upgrade --install docuquery ./docuquery/helm/docuquery \
  -f ./docuquery/helm/docuquery/values-staging.yaml \
  --namespace docuquery-staging \
  --create-namespace
```

### Production (Blue/Green)

```bash
# Deploy to production
helm upgrade --install docuquery ./docuquery/helm/docuquery \
  -f ./docuquery/helm/docuquery/values-production.yaml \
  --namespace docuquery-production \
  --set image.tag=v1.5.0

# Switch traffic (after testing)
./docuquery/k8s/blue-green/switch.sh green

# Rollback if needed
./docuquery/k8s/blue-green/switch.sh blue
```

---

## CI/CD Pipeline

### Workflow Stages

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Build &   │───▶│  Security   │───▶│   Build     │───▶│   Deploy    │
│    Test     │    │    Scan     │    │   Image     │    │ Blue/Green  │
├─────────────┤    ├─────────────┤    ├─────────────┤    ├─────────────┤
│ pytest      │    │ Trivy       │    │ Multi-arch  │    │ Helm        │
│ 80% coverage│    │ Grype       │    │ amd64/arm64 │    │ Smoke tests │
│ Ruff/Black  │    │ Bandit      │    │ GHCR push   │    │ Monitoring  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Branch Strategy

| Branch | Trigger | Actions |
|--------|---------|---------|
| `main` | Push/PR | Lint, test, security scan |
| `stage3-development` | Push | Full CI + Docker build |
| `stage4-staging` | Push | CI + Deploy to staging |
| `stage5-production` | Push/Tag | CI + Blue/Green deploy |

---

## API Documentation

Once running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Example: Query Documents

```bash
# Upload a document
curl -X POST http://localhost:8000/api/v1/documents/upload \
  -F "file=@document.pdf"

# Query the document
curl -X POST http://localhost:8000/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main topic of this document?"}'
```

---

## Monitoring & Observability

### Metrics (Prometheus)

Key metrics exposed at `/metrics`:
- `http_requests_total` - Request count by status and endpoint
- `http_request_duration_seconds` - Request latency histogram
- `document_processing_duration_seconds` - Document processing time
- `vector_search_duration_seconds` - Vector search latency
- `active_connections` - Current active connections

### Dashboards (Grafana)

Pre-configured dashboards:
- **API Performance** - Request rate, latency percentiles, error rate
- **System Metrics** - CPU, memory, disk usage
- **SLO Dashboard** - Availability, latency SLIs, error budget

### Logging (Loki)

Structured JSON logs with:
- Request ID correlation
- User context
- Performance timing
- Error stack traces

---

## Contributing

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with tests
4. Ensure all checks pass: `make quality && make test`
5. Submit a pull request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- OpenAI for GPT-4o language model
- Qdrant for vector database
- FastAPI for the web framework
- The Kubernetes community for orchestration tools

---

<p align="center">
  <strong>Built with care for the AI Software Architecture Workshop</strong>
</p>
