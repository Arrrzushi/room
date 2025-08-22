from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import uvicorn

# Import our custom modules
from room_rag.engine import RoomRAG
from room_translate.translator import RoomTranslator

# Import voice processor (simplified version)
from room_voice.processor import RoomVoice

app = FastAPI(
    title="Room - The Multilingual Cute AI Assistant",
    description="A friendly AI that helps you chat with your documents in multiple languages",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize components
rag_engine = RoomRAG()
translator = RoomTranslator()
voice_processor = RoomVoice()

# Request/Response models
class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    use_voice: bool = False

class ChatResponse(BaseModel):
    response: str
    language: str
    voice_url: Optional[str] = None

class UploadResponse(BaseModel):
    message: str
    filename: str

class ApiKeyRequest(BaseModel):
    api_key: str
    base_url: Optional[str] = None

@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Welcome to Room AI Assistant! 🏠"}

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "message": "Room AI Assistant is running smoothly!",
        "services": {
            "rag": "available",
            "translation": "available", 
            "voice": "basic" if voice_processor.is_available() else "coming_soon",
            "openai": "available" if rag_engine.openai_client else "not_configured"
        }
    }

@app.post("/set-openai-key")
async def set_openai_api_key(request: ApiKeyRequest):
    """Set OpenAI API key for enhanced AI capabilities."""
    try:
        success = rag_engine.set_openai_api_key(request.api_key, request.base_url)
        if success:
            return {"message": "OpenAI API key set successfully! AI capabilities are now enhanced."}
        else:
            raise HTTPException(status_code=400, detail="Failed to set OpenAI API key")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload a document for processing."""
    try:
        # Process the uploaded file
        result = await rag_engine.process_document(file)
        return UploadResponse(
            message="Document processed successfully!",
            filename=file.filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat_with_documents(request: ChatRequest):
    """Chat with the uploaded documents."""
    try:
        # Get response from RAG engine
        response = await rag_engine.get_response(request.message, request.language)
        
        # Translate if needed
        if request.language == "hi":
            response = translator.translate(response, "en", "hi")
        
        # Generate voice if requested
        voice_url = None
        if request.use_voice and voice_processor.is_available():
            voice_url = voice_processor.text_to_speech(response, request.language)
        
        return ChatResponse(
            response=response,
            language=request.language,
            voice_url=voice_url
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/languages")
async def get_supported_languages():
    """Get supported languages."""
    return {
        "translation": translator.get_supported_languages(),
        "voice": voice_processor.get_supported_languages()
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)