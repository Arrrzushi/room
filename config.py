"""
Room AI Assistant Configuration

This module contains all configuration options for the Room application.
"""

import os
from pathlib import Path
from typing import List

# Base paths
BASE_DIR = Path(__file__).parent
BACKEND_DIR = BASE_DIR / "backend"
FRONTEND_DIR = BASE_DIR / "frontend"

# Backend configuration
BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# Frontend configuration
FRONTEND_PORT = int(os.getenv("FRONTEND_PORT", "3000"))
REACT_APP_API_URL = os.getenv("REACT_APP_API_URL", f"http://localhost:{BACKEND_PORT}")

# AI Model configuration
MODEL_CACHE_DIR = Path(os.getenv("MODEL_CACHE_DIR", BACKEND_DIR / "models"))
CUDA_VISIBLE_DEVICES = os.getenv("CUDA_VISIBLE_DEVICES", "-1")  # -1 for CPU, 0 for GPU

# Translation models
INDICTRANS2_MODEL_PATH = Path(os.getenv("INDICTRANS2_MODEL_PATH", BACKEND_DIR / "room_translate" / "models"))

# Voice processing
WHISPER_MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "base")  # tiny, base, small, medium, large
TTS_MODEL_PATH = Path(os.getenv("TTS_MODEL_PATH", BACKEND_DIR / "room_voice" / "models"))

# Storage configuration
RAG_STORAGE_PATH = Path(os.getenv("RAG_STORAGE_PATH", BACKEND_DIR / "room_rag" / "storage"))
AUDIO_STORAGE_PATH = Path(os.getenv("AUDIO_STORAGE_PATH", BACKEND_DIR / "static" / "audio"))

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", f"http://localhost:{FRONTEND_PORT},http://localhost:{BACKEND_PORT}").split(",")

# RAG configuration
RAG_CHUNK_SIZE = int(os.getenv("RAG_CHUNK_SIZE", "200"))
RAG_OVERLAP = int(os.getenv("RAG_OVERLAP", "50"))
RAG_TOP_K = int(os.getenv("RAG_TOP_K", "3"))

# Voice configuration
AUDIO_SAMPLE_RATE = int(os.getenv("AUDIO_SAMPLE_RATE", "16000"))
NO_SPEECH_THRESHOLD = float(os.getenv("NO_SPEECH_THRESHOLD", "0.5"))

# File upload configuration
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "10 * 1024 * 1024"))  # 10MB
ALLOWED_FILE_TYPES = {
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "text/markdown": ".md"
}

# Ensure directories exist
def ensure_directories():
    """Create necessary directories if they don't exist."""
    directories = [
        MODEL_CACHE_DIR,
        INDICTRANS2_MODEL_PATH,
        TTS_MODEL_PATH,
        RAG_STORAGE_PATH,
        AUDIO_STORAGE_PATH
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)

# Configuration validation
def validate_config():
    """Validate configuration values."""
    if not (1 <= BACKEND_PORT <= 65535):
        raise ValueError(f"Invalid backend port: {BACKEND_PORT}")
    
    if not (1 <= FRONTEND_PORT <= 65535):
        raise ValueError(f"Invalid frontend port: {FRONTEND_PORT}")
    
    if RAG_CHUNK_SIZE <= 0:
        raise ValueError(f"Invalid RAG chunk size: {RAG_CHUNK_SIZE}")
    
    if RAG_OVERLAP < 0:
        raise ValueError(f"Invalid RAG overlap: {RAG_OVERLAP}")
    
    if RAG_TOP_K <= 0:
        raise ValueError(f"Invalid RAG top-k: {RAG_TOP_K}")

# Initialize configuration
if __name__ == "__main__":
    ensure_directories()
    validate_config()
    print("✅ Configuration validated successfully!")
    print(f"📍 Backend: {BACKEND_HOST}:{BACKEND_PORT}")
    print(f"📍 Frontend: http://localhost:{FRONTEND_PORT}")
    print(f"📍 Model cache: {MODEL_CACHE_DIR}")
    print(f"📍 RAG storage: {RAG_STORAGE_PATH}")
    print(f"📍 Audio storage: {AUDIO_STORAGE_PATH}")

