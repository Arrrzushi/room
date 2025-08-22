import pytest
import os
from pathlib import Path
import shutil
from room_rag.engine import RoomRAG

@pytest.fixture
def rag_engine():
    """Create a test RAG engine instance."""
    engine = RoomRAG()
    yield engine
    # Cleanup after tests
    if os.path.exists("room_rag"):
        shutil.rmtree("room_rag")

@pytest.mark.asyncio
async def test_document_ingestion(rag_engine):
    """Test document ingestion functionality."""
    # Test content
    content = b"""
    Room is a multilingual AI assistant that helps you chat with your documents.
    It supports both English and Hindi, and can process text and voice input.
    """
    filename = "test.txt"
    
    # Test ingestion
    doc_id = await rag_engine.ingest(content, filename)
    assert doc_id is not None
    assert doc_id.startswith("doc_")
    assert len(rag_engine.documents) > 0

@pytest.mark.asyncio
async def test_document_query(rag_engine):
    """Test document querying functionality."""
    # First ingest a document
    content = b"""
    Room is a multilingual AI assistant that helps you chat with your documents.
    It supports both English and Hindi, and can process text and voice input.
    """
    filename = "test.txt"
    await rag_engine.ingest(content, filename)
    
    # Test querying
    response = await rag_engine.query("What is Room?")
    assert response is not None
    assert "Room" in response
    assert "AI assistant" in response

@pytest.mark.asyncio
async def test_clear_data(rag_engine):
    """Test clearing all data."""
    # First ingest a document
    content = b"Test content"
    filename = "test.txt"
    await rag_engine.ingest(content, filename)
    
    # Clear data
    rag_engine.clear()
    
    # Verify data is cleared
    assert len(rag_engine.documents) == 0
    assert rag_engine.index.ntotal == 0




