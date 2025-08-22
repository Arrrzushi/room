# Room - Setup and Deployment Guide

This guide will walk you through running, testing, and deploying the Room AI Assistant.

## Prerequisites

- Python 3.9+
- Node.js 16+
- Docker and Docker Compose
- NVIDIA GPU (optional, but recommended)
- NVIDIA CUDA Toolkit (if using GPU)

## 🚀 Quick Start (Docker)

The easiest way to run Room is using Docker Compose:

```bash
# Clone the repository (if you haven't already)
git clone <your-repo-url>
cd room

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Access the application
Frontend: http://localhost:3000
API: http://localhost:8000
API Docs: http://localhost:8000/docs
```

## 💻 Development Setup

### Backend Setup

```bash
# Navigate to backend directory
cd room/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install test dependencies
pip install pytest pytest-asyncio pytest-cov

# Run the backend
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd room/frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 🧪 Running Tests

### Backend Tests

```bash
# Navigate to backend directory
cd room/backend

# Activate virtual environment (if not already activated)
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Run all tests
pytest

# Run tests with coverage report
pytest --cov=.

# Run specific test file
pytest tests/test_rag.py
pytest tests/test_translate.py
pytest tests/test_voice.py
pytest tests/test_api.py
```

### Frontend Tests

```bash
# Navigate to frontend directory
cd room/frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Production Deployment

### Option 1: Docker Deployment (Recommended)

```bash
# Build and start services
docker-compose -f docker-compose.yml up -d --build

# Check service status
docker-compose ps

# Monitor logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Manual Deployment

#### Backend Deployment

```bash
# Navigate to backend directory
cd room/backend

# Install production dependencies
pip install -r requirements.txt

# Start with Gunicorn (production server)
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Frontend Deployment

```bash
# Navigate to frontend directory
cd room/frontend

# Build production assets
npm run build

# Serve using a production server (e.g., nginx or serve)
npx serve -s build
```

## 🔍 Health Checks

After deployment, verify these endpoints:

1. Backend Health: `http://localhost:8000/health`
2. Frontend: `http://localhost:3000`
3. API Documentation: `http://localhost:8000/docs`

## 📊 Monitoring

Monitor the application using:

1. Docker stats:
```bash
docker stats
```

2. Container logs:
```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🔄 Common Operations

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart containers
docker-compose down
docker-compose up -d --build
```

### Backup Data

```bash
# Backup volume data
docker run --rm -v room_model_cache:/data -v /backup:/backup ubuntu tar czf /backup/model_cache.tar.gz /data
docker run --rm -v room_audio_data:/data -v /backup:/backup ubuntu tar czf /backup/audio_data.tar.gz /data
```

### Troubleshooting

1. If containers fail to start:
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

2. If models fail to load:
```bash
# Clear model cache
docker-compose down
docker volume rm room_model_cache
docker-compose up -d
```

3. Reset everything:
```bash
# Remove all containers and volumes
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
CUDA_VISIBLE_DEVICES=0  # Set to -1 for CPU only
MODEL_CACHE_DIR=/app/models
LOG_LEVEL=INFO

# Frontend
REACT_APP_API_URL=http://localhost:8000
NODE_ENV=production
```

## 🔒 Security Notes

1. In production:
   - Update CORS settings in `main.py`
   - Use HTTPS
   - Set proper environment variables
   - Use proper authentication

2. For public deployment:
   - Use a reverse proxy (nginx)
   - Set up SSL/TLS
   - Configure proper firewalls
   - Monitor system resources

## 📈 Performance Optimization

1. GPU Acceleration:
   - Ensure NVIDIA drivers are installed
   - Use CUDA-enabled Docker base image
   - Set proper CUDA environment variables

2. Model Optimization:
   - Use quantized models where possible
   - Adjust batch sizes based on available memory
   - Monitor GPU memory usage

## 🆘 Support

If you encounter any issues:
1. Check the logs: `docker-compose logs -f`
2. Verify all services are running: `docker-compose ps`
3. Check system resources: `docker stats`
4. Ensure all ports are available: `netstat -an | grep LISTEN`




