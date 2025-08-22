# NEXUS Platform - Project Structure

This document outlines the structure and organization of the NEXUS Intelligent Document Analysis Platform.

## 📁 Root Directory Structure

```
nexus/
├── backend/                 # FastAPI backend application
├── frontend/               # React frontend application
├── uploads/                # Document upload storage
├── docker-compose.yml      # Docker services configuration
├── README.md               # Project documentation
├── SETUP.md                # Setup instructions
├── start.py                # Platform startup script
├── config.py               # Configuration settings
├── Makefile                # Build and management commands
├── .env.example            # Environment variables template
└── .gitignore             # Git ignore patterns
```

## 🐍 Backend Structure (`backend/`)

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── Dockerfile             # Backend container configuration
├── room_rag/              # RAG (Retrieval-Augmented Generation) engine
│   ├── __init__.py
│   └── engine.py          # Core RAG functionality with OpenAI integration
├── room_translate/         # Translation services
│   ├── __init__.py
│   └── translator.py      # Multilingual support (English/Hindi)
├── room_voice/            # Voice processing (coming soon)
│   ├── __init__.py
│   └── processor.py      # Voice-to-text and text-to-speech
└── static/                # Static file serving
    └── audio/            # Audio file storage
```

### Backend Components

- **FastAPI Application**: High-performance Python web framework
- **RAG Engine**: OpenAI-powered document analysis and intelligent responses
- **Translation Service**: Multi-language document processing
- **Voice Processing**: Audio input/output capabilities (planned)
- **File Management**: Document upload, storage, and processing

## ⚛️ Frontend Structure (`frontend/`)

```
frontend/
├── public/                 # Static assets
│   ├── index.html         # Main HTML template
│   ├── nexus-logo.svg     # NEXUS platform logo
│   ├── nexus-avatar.svg   # AI assistant avatar
│   └── manifest.json      # PWA manifest
├── src/                   # React source code
│   ├── components/        # Reusable UI components
│   │   ├── Intro.js       # Landing/intro page
│   │   ├── Header.js      # Application header
│   │   ├── FileUpload.js  # Document upload interface
│   │   └── Chat.js        # AI chat interface
│   ├── App.js             # Main application component
│   ├── index.js           # Application entry point
│   └── theme.js           # Material-UI theme configuration
├── package.json           # Node.js dependencies
├── Dockerfile             # Frontend container configuration
└── nginx.conf             # Nginx configuration for production
```

### Frontend Components

- **Intro Page**: Sexy, dark-themed landing page with NEXUS branding
- **Header**: Professional navigation with NEXUS logo and slogan
- **File Upload**: Drag-and-drop document upload interface
- **Chat Interface**: AI-powered document analysis chat
- **Dark Theme**: Modern, minimalist, professional UI design

## 🐳 Docker Configuration

### Services

- **nexus-backend**: FastAPI backend service (port 8000)
- **nexus-frontend**: React frontend service (port 3000)

### Volumes

- **uploads**: Document storage persistence
- **node_modules**: Frontend dependency caching

## 🔧 Configuration Files

### Environment Variables (`.env`)

```bash
# OpenAI Configuration
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://api.openai.com/v1

# API Settings
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true

# File Upload
MAX_FILE_SIZE=52428800  # 50MB
UPLOAD_DIR=./uploads

# RAG Configuration
CHUNK_SIZE=2000
TOP_K_CHUNKS=5
```

### Docker Compose (`docker-compose.yml`)

- Service definitions for backend and frontend
- Volume mappings for data persistence
- Environment variable injection
- Health checks and dependencies

## 🚀 Management Commands

### Makefile Commands

```bash
make help      # Show available commands
make build     # Build all Docker images
make up        # Start all services
make down      # Stop all services
make restart   # Restart all services
make logs      # Show service logs
make status    # Show service status
make health    # Check service health
make clean     # Clean up containers and images
make test      # Run tests
make lint      # Run linting
make format    # Format code
```

### Python Scripts

- **`start.py`**: Platform startup and health monitoring
- **`config.py`**: Configuration management and validation

## 📊 Key Features

### Document Processing

- **Supported Formats**: PDF, TXT, DOC, DOCX
- **Text Extraction**: Intelligent PDF parsing and cleaning
- **Chunking**: Smart document segmentation for analysis
- **Storage**: Efficient document storage and retrieval

### AI Capabilities

- **OpenAI Integration**: GPT-4 powered responses
- **Custom API Support**: Alternative OpenAI-compatible providers
- **RAG Engine**: Context-aware document analysis
- **Intelligent Responses**: Professional, accurate insights

### User Experience

- **Dark Theme**: Modern, professional interface
- **Responsive Design**: Mobile and desktop optimized
- **Drag & Drop**: Intuitive file upload
- **Real-time Chat**: Instant AI responses

## 🔒 Security Features

- **API Key Management**: Secure credential handling
- **CORS Configuration**: Configurable cross-origin policies
- **File Validation**: Secure file type and size checking
- **Environment Isolation**: Docker-based security

## 📈 Performance Optimizations

- **Async Processing**: Non-blocking API operations
- **Efficient Search**: FAISS-based vector similarity
- **Caching**: Model and response caching
- **Resource Management**: Optimized Docker configurations

## 🧪 Testing & Quality

- **Backend Testing**: Pytest-based test suite
- **Frontend Testing**: React testing library
- **Code Quality**: Flake8, Black, isort
- **Health Monitoring**: Built-in health checks

## 🚀 Deployment

### Production

```bash
# Build and start
make start

# Or individual steps
make build
make up
```

### Development

```bash
# Development mode
make dev

# Individual services
cd backend && uvicorn main:app --reload
cd frontend && npm start
```

## 📚 Documentation

- **README.md**: Comprehensive project overview
- **SETUP.md**: Detailed setup instructions
- **PROJECT_STRUCTURE.md**: This file
- **API Documentation**: Auto-generated from FastAPI

---

**NEXUS Platform** - Where intelligence meets your documents.

