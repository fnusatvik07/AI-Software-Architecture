"""
Application settings using Pydantic Settings.
Loads from environment variables with validation.
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional
from enum import Enum


class Environment(str, Enum):
    DEV = "dev"
    STAGING = "staging"
    PROD = "prod"


class LLMProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Environment
    environment: Environment = Field(default=Environment.DEV)
    debug: bool = Field(default=False)
    
    # API Configuration
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8000)
    api_prefix: str = Field(default="/api/v1")
    
    # API Keys
    openai_api_key: str = Field(..., description="OpenAI API key for embeddings and LLM")
    anthropic_api_key: Optional[str] = Field(default=None, description="Anthropic API key for Claude (optional fallback)")
    
    # LLM Configuration - Default to OpenAI
    llm_provider: LLMProvider = Field(default=LLMProvider.OPENAI)
    llm_model: str = Field(default="gpt-4o")
    llm_temperature: float = Field(default=0.0, ge=0.0, le=1.0)
    llm_max_tokens: int = Field(default=1024)
    llm_timeout: int = Field(default=30)
    
    # Embedding Configuration
    embedding_model: str = Field(default="text-embedding-3-large")
    embedding_dimensions: int = Field(default=3072)
    
    # Vector Store Configuration
    qdrant_host: str = Field(default="localhost")
    qdrant_port: int = Field(default=6333)
    qdrant_collection: str = Field(default="docuquery")
    
    # Chunking Configuration
    chunk_size: int = Field(default=500, ge=100, le=2000)
    chunk_overlap: int = Field(default=50, ge=0, le=200)
    
    # Retrieval Configuration
    retrieval_top_k: int = Field(default=5, ge=1, le=20)
    retrieval_score_threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    
    # Rate Limiting
    rate_limit_requests: int = Field(default=100)
    rate_limit_window: int = Field(default=60)  # seconds
    
    # Logging
    log_level: str = Field(default="INFO")
    log_format: str = Field(default="json")
    
    # Prompt Configuration
    prompt_version: str = Field(default="v1")
    prompts_dir: str = Field(default="src/prompts/templates")
    
    # Feature Flags
    enable_reranking: bool = Field(default=False)
    enable_semantic_cache: bool = Field(default=False)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # Ignore extra env vars like daytona_api_key


# Singleton instance
settings = Settings()
