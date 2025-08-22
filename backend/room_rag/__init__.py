"""
Room RAG (Retrieval-Augmented Generation) module.

This module provides document processing and question-answering capabilities
using FAISS vector database and sentence transformers.
"""

from .engine import RoomRAG

__all__ = ['RoomRAG']

