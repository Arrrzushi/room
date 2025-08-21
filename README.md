# 🏠 Room - The Multilingual Cute AI Assistant

Room is your friendly AI companion that helps you chat with your documents in multiple languages! With a cute and modern interface, Room makes document interaction fun and accessible.

## ✨ Features

- 📚 **Document Processing**: Upload PDFs and text files for instant knowledge extraction
- 🌏 **Multilingual Support**: Chat in English or Hindi - Room understands both!
- 🎤 **Voice Interaction**: Talk to Room naturally with voice input/output
- 🎨 **Cute Modern UI**: Enjoy a delightful chat experience with our mascot Roomy
- 🚀 **Fast & Efficient**: Get responses in under 2 seconds

## 🛠️ Tech Stack

- **Backend**: FastAPI, FAISS Vector DB
- **Frontend**: React with Material-UI
- **AI/ML**: Custom RAG implementation, IndicTrans2, Whisper, Coqui TTS
- **Deployment**: Docker & Docker Compose

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/room.git
   cd room
   ```

2. Start with Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## 📱 Screenshots

[Coming Soon]

## 🤝 Usage Examples

1. **Upload a Document**:
   - Click the Upload button
   - Select your PDF/text file
   - Wait for confirmation

2. **Text Chat**:
   - Type your question in English or Hindi
   - Get instant responses in the same language

3. **Voice Chat**:
   - Click the microphone icon
   - Speak your question
   - Listen to Room's response

## 🔧 Development Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## 📝 License

MIT License - feel free to use and modify!

## 🌟 Credits

Built with love by [Your Name] using cutting-edge AI technologies.


