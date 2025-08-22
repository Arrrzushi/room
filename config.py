"""
NEXUS Configuration
Configuration settings for the NEXUS Intelligent Document Analysis Platform
"""

import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))
API_RELOAD = os.getenv("API_RELOAD", "true").lower() == "true"

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# File Upload Configuration
UPLOAD_DIR = BASE_DIR / "uploads"
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {".pdf", ".txt", ".doc", ".docx"}

# RAG Configuration
CHUNK_SIZE = 2000
TOP_K_CHUNKS = 5

# Translation Configuration
SUPPORTED_LANGUAGES = ["en", "hi"]

# Voice Configuration
VOICE_ENABLED = os.getenv("VOICE_ENABLED", "false").lower() == "true"

# Logging Configuration
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Security Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

# Performance Configuration
MAX_WORKERS = int(os.getenv("MAX_WORKERS", 4))
WORKER_TIMEOUT = int(os.getenv("WORKER_TIMEOUT", 120))

