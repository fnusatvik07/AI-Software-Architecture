# ===========================================
# AI Software Architecture - Root Makefile
# ===========================================
# Run all commands from the root directory

# Project directory
PROJECT_DIR = docuquery

# Virtual environment paths
VENV = .venv
PYTHON = $(VENV)/bin/python3
PIP = $(VENV)/bin/pip3

.PHONY: help install install-dev lint format type-check security test test-unit test-int test-e2e test-security test-all coverage run dev streamlit docker-build docker-run docker-up docker-down clean pre-commit sonar ci quality frontend

# Default target
help:
	@echo "AI Software Architecture - Development Commands"
	@echo "================================================"
	@echo ""
	@echo "Setup:"
	@echo "  make install       Install production dependencies"
	@echo "  make install-dev   Install development dependencies"
	@echo "  make pre-commit    Install pre-commit hooks"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint          Run all linters (ruff)"
	@echo "  make format        Format code (black, isort)"
	@echo "  make type-check    Run mypy type checking"
	@echo "  make security      Run security checks (bandit, safety)"
	@echo "  make quality       Run ALL quality checks"
	@echo ""
	@echo "Testing:"
	@echo "  make test          Run all tests"
	@echo "  make test-unit     Run unit tests"
	@echo "  make test-int      Run integration tests"
	@echo "  make test-e2e      Run e2e tests"
	@echo "  make test-security Run security tests"
	@echo "  make coverage      Run tests with coverage report"
	@echo ""
	@echo "Running:"
	@echo "  make run           Run FastAPI server (port 8000)"
	@echo "  make dev           Run FastAPI with auto-reload"
	@echo "  make streamlit     Run Streamlit app (port 8501)"
	@echo "  make frontend      Run React frontend (port 5173)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build  Build Docker image"
	@echo "  make docker-up     Start with docker-compose"
	@echo "  make docker-down   Stop docker-compose"
	@echo "  make qdrant        Start Qdrant only"
	@echo ""
	@echo "Other:"
	@echo "  make clean         Clean up generated files"
	@echo "  make sonar         Run SonarQube analysis"
	@echo "  make ci            Run full CI simulation"

# ===========================================
# Setup Commands
# ===========================================
install:
	cd $(PROJECT_DIR) && ../$(PIP) install -r requirements.txt

install-dev: install
	cd $(PROJECT_DIR) && ../$(PIP) install -r requirements-dev.txt

pre-commit:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/pre-commit install
	cd $(PROJECT_DIR) && ../$(VENV)/bin/pre-commit install --hook-type commit-msg

# ===========================================
# Code Quality Commands
# ===========================================
lint:
	@echo "Running Ruff..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/ruff check src/ tests/

format:
	@echo "Running Black..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/black src/ tests/
	@echo "Running isort..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/isort src/ tests/

format-check:
	@echo "Checking Black formatting..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/black --check --diff src/ tests/
	@echo "Checking isort..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/isort --check-only --diff src/ tests/

type-check:
	@echo "Running MyPy..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/mypy src/ --ignore-missing-imports

security:
	@echo "Running Bandit..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/bandit -r src/ -f txt || true
	@echo "Running Safety..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/safety check -r requirements.txt || true
	@echo "Running pip-audit..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/pip-audit -r requirements.txt || true

quality: lint format-check type-check security
	@echo "All quality checks completed!"

# ===========================================
# Testing Commands
# ===========================================
test:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/pytest tests/ -v

test-unit:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/pytest tests/unit/ -v

test-int:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/pytest tests/integration/ -v

test-e2e:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/pytest tests/e2e/ -v

test-security:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/pytest tests/security/ -v

test-all: test-unit test-int test-e2e test-security

coverage:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/pytest tests/ -v --cov=src --cov-report=html --cov-report=xml --cov-report=term
	@echo "Coverage report generated in $(PROJECT_DIR)/htmlcov/"

# ===========================================
# Running Commands
# ===========================================
run:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/uvicorn src.api.main:app --host 0.0.0.0 --port 8000

dev:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload

streamlit:
	cd $(PROJECT_DIR) && ../$(VENV)/bin/streamlit run streamlit_app.py --server.port 8501

frontend:
	cd $(PROJECT_DIR)/frontend && npm install && npm run dev

# Load sample documents
seed:
	cd $(PROJECT_DIR) && ../$(PYTHON) scripts/seed_documents.py

# Run evaluation suite
eval:
	cd $(PROJECT_DIR) && ../$(PYTHON) scripts/run_evals.py

# ===========================================
# Docker Commands
# ===========================================
docker-build:
	cd $(PROJECT_DIR) && docker build -t docuquery:latest -f docker/Dockerfile .

docker-run:
	cd $(PROJECT_DIR) && docker run -p 8000:8000 --env-file .env docuquery:latest

docker-up:
	cd $(PROJECT_DIR) && docker-compose -f docker/docker-compose.yml up -d

docker-down:
	cd $(PROJECT_DIR) && docker-compose -f docker/docker-compose.yml down

# Start Qdrant only
qdrant:
	docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

# ===========================================
# SonarQube
# ===========================================
sonar:
	@echo "Running SonarQube analysis..."
	cd $(PROJECT_DIR) && ../$(VENV)/bin/sonar-scanner || echo "SonarQube scanner not installed or configured"

# ===========================================
# Cleanup Commands
# ===========================================
clean:
	@echo "Cleaning up..."
	cd $(PROJECT_DIR) && find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	cd $(PROJECT_DIR) && find . -type f -name "*.pyc" -delete 2>/dev/null || true
	cd $(PROJECT_DIR) && find . -type f -name "*.pyo" -delete 2>/dev/null || true
	cd $(PROJECT_DIR) && rm -rf .pytest_cache .mypy_cache .ruff_cache
	cd $(PROJECT_DIR) && rm -rf .coverage htmlcov coverage.xml
	cd $(PROJECT_DIR) && rm -rf dist build *.egg-info
	cd $(PROJECT_DIR) && rm -rf test-results*.xml
	@echo "Cleanup complete!"

# ===========================================
# CI Simulation
# ===========================================
ci: quality test-all coverage
	@echo "CI simulation complete!"
