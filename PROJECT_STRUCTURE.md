# Room AI Assistant - Project Structure

This document describes the organization and structure of the Room AI Assistant project.

## 📁 Directory Structure

```
room/
├── README.md                 # Main project documentation
├── SETUP.md                  # Setup and deployment guide
├── PROJECT_STRUCTURE.md      # This file
├── .gitignore               # Git ignore rules
├── .dockerignore            # Docker ignore rules
├── docker-compose.yml       # Docker services configuration
├── env.example              # Environment variables template
├── config.py                # Configuration management
├── start.py                 # Backend startup script
├── health_check.py          # Health check utility
├── demo.py                  # Demo and testing script
├── Makefile                 # Development commands
│
├── backend/                 # Python FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile         # Backend container
│   ├── pytest.ini         # Test configuration
│   │
│   ├── room_rag/          # RAG (Retrieval-Augmented Generation) module
│   │   ├── __init__.py    # Package initialization
│   │   └── engine.py      # RAG engine implementation
│   │
│   ├── room_translate/    # Translation module
│   │   ├── __init__.py    # Package initialization
│   │   └── translator.py  # Translation engine
│   │
│   ├── room_voice/        # Voice processing module
│   │   ├── __init__.py    # Package initialization
│   │   └── processor.py   # Voice processing engine
│   │
│   ├── models/            # AI model storage (auto-created)
│   ├── static/            # Static files
│   │   └── audio/         # Generated audio files
│   └── tests/             # Backend tests
│       ├── test_api.py    # API endpoint tests
│       ├── test_rag.py    # RAG functionality tests
│       ├── test_translate.py # Translation tests
│       └── test_voice.py  # Voice processing tests
│
└── frontend/               # React frontend application
    ├── package.json        # Node.js dependencies
    ├── Dockerfile         # Frontend container
    │
    ├── public/            # Static assets
    │   ├── index.html     # Main HTML file
    │   ├── manifest.json  # PWA manifest
    │   ├── roomy-logo.svg # Application logo
    │   └── roomy-avatar.svg # AI assistant avatar
    │
    └── src/               # React source code
        ├── index.js       # Application entry point
        ├── App.js         # Main application component
        ├── theme.js       # Material-UI theme configuration
        │
        └── components/    # React components
            ├── Header.js  # Application header
            ├── Chat.js    # Chat interface
            └── FileUpload.js # File upload component
```

## 🏗️ Architecture Overview

### Backend (FastAPI)
- **FastAPI**: Modern, fast web framework for building APIs
- **RAG Engine**: Document processing and question-answering using FAISS and sentence transformers
- **Translation Engine**: Multilingual support using IndicTrans2 models
- **Voice Engine**: Speech-to-text and text-to-speech using Whisper and Coqui TTS

### Frontend (React)
- **React 18**: Modern React with hooks and functional components
- **Material-UI**: Beautiful, accessible UI components
- **Custom Theme**: Cute, friendly design with soft colors
- **Responsive Design**: Works on desktop and mobile devices

### Key Features
1. **Document Processing**: Upload and process PDF/text files
2. **Multilingual Support**: English and Hindi language support
3. **Voice Interaction**: Natural voice input/output
4. **Modern UI**: Cute, user-friendly interface
5. **Fast Response**: Sub-2-second response times

## 🔧 Development Tools

### Backend Development
- **Python 3.9+**: Modern Python with async/await support
- **FastAPI**: Auto-generated API documentation
- **Pytest**: Comprehensive testing framework
- **Docker**: Containerized development and deployment

### Frontend Development
- **Node.js 16+**: Modern JavaScript runtime
- **React Scripts**: Create React App tooling
- **Material-UI**: Component library with theming
- **Axios**: HTTP client for API communication

### DevOps
- **Docker Compose**: Multi-service development environment
- **Makefile**: Common development commands
- **Health Checks**: Service monitoring and validation
- **Environment Configuration**: Flexible configuration management

## 🚀 Getting Started

### Quick Start (Docker)
```bash
# Start all services
docker-compose up -d

# Access the application
Frontend: http://localhost:3000
Backend: http://localhost:8000
API Docs: http://localhost:8000/docs
```

### Development Setup
```bash
# Install dependencies
make install-dev

# Start development servers
make start-dev

# Run tests
make test

# Check health
make health
```

### Available Commands
```bash
make help          # Show all available commands
make install-dev   # Install development dependencies
make start-dev     # Start development servers
make start-prod    # Start production servers
make stop          # Stop all servers
make clean         # Clean up generated files
make test          # Run tests
make lint          # Run linting
make format        # Format code
make logs          # Show logs
make health        # Check service health
```

## 📚 API Endpoints

### Core Endpoints
- `GET /health` - Service health check
- `POST /upload` - Upload documents
- `POST /ask` - Ask questions (text or voice)
- `POST /voice` - Process voice input

### Features
- **Document Upload**: Support for PDF and text files
- **Question Answering**: RAG-based document querying
- **Language Detection**: Automatic English/Hindi detection
- **Translation**: Seamless language translation
- **Voice Processing**: Speech-to-text and text-to-speech

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest -v                    # Run all tests
pytest --cov=.              # Run with coverage
pytest tests/test_rag.py    # Run specific test file
```

### Frontend Tests
```bash
cd frontend
npm test                     # Run tests in watch mode
npm test -- --watchAll=false # Run tests once
```

## 🔍 Monitoring and Debugging

### Health Checks
```bash
python health_check.py       # Comprehensive health check
python config.py             # Validate configuration
```

### Demo and Testing
```bash
python demo.py               # Run automated demo
python demo.py --interactive # Interactive demo mode
```

## 📦 Deployment

### Docker Deployment
```bash
# Build and start production services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Configuration
1. Copy `env.example` to `.env`
2. Update configuration values
3. Restart services

## 🤝 Contributing

### Code Style
- **Python**: Black formatting, isort imports
- **JavaScript**: ESLint configuration
- **Tests**: Comprehensive test coverage
- **Documentation**: Clear docstrings and comments

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Run linting and formatting
4. Submit pull request

## 📄 License

MIT License - feel free to use and modify!

## 🌟 Credits

Built with love using cutting-edge AI technologies including:
- **IndicTrans2**: Multilingual translation
- **Whisper**: Speech recognition
- **Coqui TTS**: Text-to-speech
- **FAISS**: Vector similarity search
- **Sentence Transformers**: Text embeddings

