import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Room" in data["message"]

def test_upload_document():
    """Test document upload endpoint."""
    content = b"Test document content"
    files = {"file": ("test.txt", content, "text/plain")}
    response = client.post("/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "doc_id" in data

def test_ask_question_english():
    """Test asking questions in English."""
    # First upload a document
    content = b"Room is a multilingual AI assistant."
    files = {"file": ("test.txt", content, "text/plain")}
    client.post("/upload", files=files)
    
    # Test asking a question
    query = {"text": "What is Room?", "use_voice": False}
    response = client.post("/ask", json=query)
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert "Room" in data["text"]

def test_ask_question_hindi():
    """Test asking questions in Hindi."""
    # First upload a document
    content = b"Room is a multilingual AI assistant."
    files = {"file": ("test.txt", content, "text/plain")}
    client.post("/upload", files=files)
    
    # Test asking a question in Hindi
    query = {"text": "रूम क्या है?", "use_voice": False}
    response = client.post("/ask", json=query)
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert isinstance(data["text"], str)

def test_voice_query():
    """Test voice query endpoint."""
    # Create test audio data
    audio_data = b"dummy audio data"  # In real test, use actual audio data
    files = {"audio": ("test.wav", audio_data, "audio/wav")}
    response = client.post("/voice", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    if data.get("use_voice"):
        assert "audio_url" in data

def test_error_handling():
    """Test error handling."""
    # Test invalid file upload
    response = client.post("/upload")
    assert response.status_code == 422  # Validation error
    
    # Test invalid question
    response = client.post("/ask", json={})
    assert response.status_code == 422  # Validation error
    
    # Test invalid voice query
    response = client.post("/voice")
    assert response.status_code == 422  # Validation error




