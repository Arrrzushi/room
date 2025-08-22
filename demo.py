#!/usr/bin/env python3
"""
Room AI Assistant Demo

This script demonstrates the capabilities of the Room application
by uploading sample documents and asking questions.
"""

import requests
import json
import time
from pathlib import Path

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

# Sample documents
SAMPLE_DOCUMENTS = {
    "ai_introduction.txt": """
Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines.
These machines can perform tasks that typically require human intelligence, such as learning, reasoning,
problem-solving, perception, and language understanding.

AI has several subfields including:
- Machine Learning: Algorithms that can learn from data
- Natural Language Processing: Understanding and generating human language
- Computer Vision: Interpreting visual information
- Robotics: Physical systems that can interact with the environment

The field of AI has seen tremendous growth in recent years, with applications in healthcare, finance,
education, transportation, and many other industries.
""",
    
    "room_assistant.txt": """
Room is a multilingual AI assistant that helps users interact with their documents.
It features:

1. Document Processing: Upload PDFs and text files for instant knowledge extraction
2. Multilingual Support: Chat in English or Hindi - Room understands both!
3. Voice Interaction: Talk to Room naturally with voice input/output
4. Cute Modern UI: Enjoy a delightful chat experience with our mascot Roomy
5. Fast & Efficient: Get responses in under 2 seconds

Room uses advanced AI technologies including:
- RAG (Retrieval-Augmented Generation) for document understanding
- IndicTrans2 for English-Hindi translation
- Whisper for speech recognition
- Coqui TTS for text-to-speech

The system is built with FastAPI backend and React frontend, making it both powerful and user-friendly.
""",
    
    "hindi_sample.txt": """
रूम एक बहुभाषी AI सहायक है जो आपको अपने दस्तावेजों के साथ बातचीत करने में मदद करता है।

इसकी मुख्य विशेषताएं हैं:
1. दस्तावेज़ प्रसंस्करण: तुरंत ज्ञान निष्कर्षण के लिए PDF और टेक्स्ट फाइलें अपलोड करें
2. बहुभाषी समर्थन: अंग्रेजी या हिंदी में चैट करें - रूम दोनों समझता है!
3. आवाज़ इंटरैक्शन: आवाज़ इनपुट/आउटपुट के साथ रूम से स्वाभाविक रूप से बात करें
4. आकर्षक आधुनिक UI: हमारे मास्कॉट रूमी के साथ एक आनंददायक चैट अनुभव का आनंद लें
5. तेज़ और कुशल: 2 सेकंड से कम समय में प्रतिक्रियाएं प्राप्त करें

रूम उन्नत AI तकनीकों का उपयोग करता है जिनमें शामिल हैं:
- दस्तावेज़ समझ के लिए RAG (Retrieval-Augmented Generation)
- अंग्रेजी-हिंदी अनुवाद के लिए IndicTrans2
- भाषण पहचान के लिए Whisper
- टेक्स्ट-टू-स्पीच के लिए Coqui TTS

सिस्टम FastAPI बैकएंड और React फ्रंटएंड के साथ बनाया गया है, जो इसे शक्तिशाली और उपयोगकर्ता-मैत्रीपूर्ण दोनों बनाता है।
"""
}

# Sample questions
SAMPLE_QUESTIONS = [
    "What is artificial intelligence?",
    "What are the main features of Room?",
    "How does Room process documents?",
    "रूम क्या है?",
    "रूम की मुख्य विशेषताएं क्या हैं?",
    "रूम दस्तावेज़ों को कैसे संसाधित करता है?"
]

def check_service_health():
    """Check if the backend service is running."""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend service is running")
            return True
        else:
            print(f"❌ Backend service error: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def upload_document(filename, content):
    """Upload a document to the Room system."""
    try:
        files = {"file": (filename, content, "text/plain")}
        response = requests.post(f"{BACKEND_URL}/upload", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Uploaded {filename}: {data['message']}")
            return data.get('doc_id')
        else:
            print(f"❌ Failed to upload {filename}: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error uploading {filename}: {e}")
        return None

def ask_question(question, use_voice=False):
    """Ask a question to the Room system."""
    try:
        data = {"text": question, "use_voice": use_voice}
        response = requests.post(f"{BACKEND_URL}/ask", json=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"❓ Question: {question}")
            print(f"🤖 Answer: {result['text']}")
            if use_voice and result.get('audio_url'):
                print(f"🎵 Audio: {result['audio_url']}")
            print("-" * 50)
            return True
        else:
            print(f"❌ Failed to ask question: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error asking question: {e}")
        return False

def run_demo():
    """Run the complete demo."""
    print("🚀 Room AI Assistant Demo")
    print("=" * 50)
    
    # Check service health
    if not check_service_health():
        print("❌ Backend service is not running. Please start the service first.")
        return
    
    print("\n📚 Uploading sample documents...")
    doc_ids = []
    
    for filename, content in SAMPLE_DOCUMENTS.items():
        doc_id = upload_document(filename, content)
        if doc_id:
            doc_ids.append(doc_id)
        time.sleep(1)  # Small delay between uploads
    
    if not doc_ids:
        print("❌ No documents were uploaded successfully.")
        return
    
    print(f"\n✅ Successfully uploaded {len(doc_ids)} documents")
    print("\n🤖 Testing question answering...")
    
    # Ask questions
    for question in SAMPLE_QUESTIONS:
        ask_question(question)
        time.sleep(2)  # Delay between questions
    
    print("\n🎉 Demo completed successfully!")
    print(f"📍 Frontend: {FRONTEND_URL}")
    print(f"📍 Backend API: {BACKEND_URL}")
    print(f"📍 API Documentation: {BACKEND_URL}/docs")

def interactive_mode():
    """Run interactive demo mode."""
    print("🎮 Interactive Demo Mode")
    print("=" * 50)
    print("Type 'quit' to exit, 'help' for commands")
    
    while True:
        try:
            command = input("\n> ").strip().lower()
            
            if command == 'quit':
                print("👋 Goodbye!")
                break
            elif command == 'help':
                print("Available commands:")
                print("  upload <filename> <content> - Upload a document")
                print("  ask <question> - Ask a question")
                print("  voice <question> - Ask a question with voice")
                print("  health - Check service health")
                print("  quit - Exit demo")
            elif command == 'health':
                check_service_health()
            elif command.startswith('upload '):
                parts = command.split(' ', 2)
                if len(parts) >= 3:
                    filename = parts[1]
                    content = parts[2]
                    upload_document(filename, content)
                else:
                    print("Usage: upload <filename> <content>")
            elif command.startswith('ask '):
                question = command[4:]
                ask_question(question)
            elif command.startswith('voice '):
                question = command[6:]
                ask_question(question, use_voice=True)
            else:
                print("Unknown command. Type 'help' for available commands.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        interactive_mode()
    else:
        run_demo()

