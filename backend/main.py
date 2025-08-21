from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import uvicorn

# Import our custom modules
from room_rag.engine import RoomRAG
from room_translate.translator import RoomTranslator
from room_voice.processor import RoomVoice

app = FastAPI(
    title="Room - The Multilingual Cute AI Assistant",
    description="A friendly AI that helps you chat with your documents in multiple languages",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize our components
rag_engine = RoomRAG()
translator = RoomTranslator()
voice_processor = RoomVoice()

class Query(BaseModel):
    text: str
    use_voice: Optional[bool] = False

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Room is ready to chat! 🐱"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        # Process and store document in RAG system
        doc_id = await rag_engine.ingest(contents, file.filename)
        return {"message": f"Document uploaded successfully! 📚", "doc_id": doc_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_question(query: Query):
    try:
        # Detect language and translate if needed
        detected_lang = translator.detect_language(query.text)
        
        if detected_lang == "hi":
            # Translate Hindi to English
            english_query = translator.translate_to_english(query.text)
            # Get RAG response
            response = await rag_engine.query(english_query)
            # Translate back to Hindi
            final_response = translator.translate_to_hindi(response)
        else:
            # Process English query directly
            final_response = await rag_engine.query(query.text)
        
        if query.use_voice:
            # Generate voice response
            audio_path = voice_processor.text_to_speech(final_response, lang=detected_lang)
            return {"text": final_response, "audio_url": audio_path}
        
        return {"text": final_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/voice")
async def process_voice(audio: UploadFile = File(...)):
    try:
        audio_data = await audio.read()
        # Convert voice to text
        text = voice_processor.speech_to_text(audio_data)
        # Process the text query using /ask endpoint
        query = Query(text=text, use_voice=True)
        return await ask_question(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)