# ===========================================
# DocuQuery Makefile
# ===========================================
# Convenient commands for development

.PHONY: help install install-dev lint format type-check security test test-unit test-int test-e2e test-security test-all coverage run dev streamlit docker-build docker-run docker-up docker-down clean pre-commit sonar ci quality

# Default target
help:
	@echo "DocuQuery - Development Commands"
	@echo "================================="
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
	@echo "  make quality       Run all quality checks"
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
	@echo "  make run           Run FastAPI server"
	@echo "  make dev           Run FastAPI with auto-reload"
	@echo "  make streamlit     Run Streamlit app"
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
	pip install -r requirements.txt

install-dev: install
	pip install -r requirements-dev.txt

pre-commit:
	pre-commit install
	pre-commit install --hook-type commit-msg

# ===========================================
# Code Quality Commands
# ===========================================
lint:
	@echo "Running Ruff..."
	ruff check src/ tests/

format:
	@echo "Running Black..."
	black src/ tests/
	@echo "Running isort..."
	isort src/ tests/

format-check:
	@echo "Checking Black formatting..."
	black --check --diff src/ tests/
	@echo "Checking isort..."
	isort --check-only --diff src/ tests/

type-check:
	@echo "Running MyPy..."
	mypy src/ --ignore-missing-imports

security:
	@echo "Running Bandit..."
	bandit -r src/ -f txt || true
	@echo "Running Safety..."
	safety check -r requirements.txt || true
	@echo "Running pip-audit..."
	pip-audit -r requirements.txt || true

quality: lint format-check type-check security
	@echo "All quality checks completed!"

# ===========================================
# Testing Commands
# ===========================================
test:
	pytest tests/ -v

test-unit:
	pytest tests/unit/ -v

test-int:
	pytest tests/integration/ -v

test-e2e:
	pytest tests/e2e/ -v

test-security:
	pytest tests/security/ -v

test-all: test-unit test-int test-e2e test-security

coverage:
	pytest tests/ -v --cov=src --cov-report=html --cov-report=xml --cov-report=term
	@echo "Coverage report generated in htmlcov/"

# ===========================================
# Running Commands
# ===========================================
run:
	uvicorn src.api.main:app --host 0.0.0.0 --port 8000

dev:
	uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload

streamlit:
	streamlit run streamlit_app.py --server.port 8501

# Load sample documents
seed:
	python scripts/seed_documents.py

# Run evaluation suite
eval:
	python scripts/run_evals.py

# ===========================================
# Docker Commands
# ===========================================
docker-build:
	docker build -t docuquery:latest -f docker/Dockerfile .

docker-run:
	docker run -p 8000:8000 --env-file .env docuquery:latest

docker-up:
	docker-compose -f docker/docker-compose.yml up -d

docker-down:
	docker-compose -f docker/docker-compose.yml down

# Start Qdrant only
qdrant:
	docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

# ===========================================
# SonarQube
# ===========================================
sonar:
	@echo "Running SonarQube analysis..."
	sonar-scanner || echo "SonarQube scanner not installed or configured"

# ===========================================
# Cleanup Commands
# ===========================================
clean:
	@echo "Cleaning up..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name "*.pyo" -delete 2>/dev/null || true
	rm -rf .pytest_cache .mypy_cache .ruff_cache
	rm -rf .coverage htmlcov coverage.xml
	rm -rf dist build *.egg-info
	rm -rf test-results*.xml
	@echo "Cleanup complete!"

# ===========================================
# CI Simulation
# ===========================================
ci: quality test-all coverage
	@echo "CI simulation complete!"
