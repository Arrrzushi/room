# 🚀 NEXUS - Intelligent Document Analysis Platform

A minimal, modern AI-powered platform for intelligent document analysis and insights.

![NEXUS Platform](https://img.shields.io/badge/NEXUS-Platform-blue?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)

## ✨ Features

- **🎯 Intelligent Document Analysis** - Powered by OpenAI GPT-4
- **📁 Multi-Format Support** - PDF, TXT, DOC, DOCX
- **🤖 AI-Powered Chat** - Ask questions about your documents
- **🎨 Modern UI** - Clean, minimal, dark theme
- **📱 Responsive Design** - Works on all devices
- **🚀 Docker Ready** - Easy deployment and scaling

## 🏗️ Architecture

- **Frontend**: React + Material-UI
- **Backend**: FastAPI + Python
- **AI Engine**: OpenAI GPT-4 with RAG
- **Database**: FAISS for document indexing
- **Deployment**: Docker + Docker Compose

## 🚀 Quick Start

### Prerequisites
- Docker (20.10+)
- Docker Compose (2.0+)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd nexus
```

### 2. Configure Environment
```bash
cp env.example .env
# Edit .env with your OpenAI API key
```

### 3. Start Services
```bash
docker-compose up -d --build
```

### 4. Access Platform
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## 🔧 Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.a4f.co/v1
API_HOST=0.0.0.0
API_PORT=8000
```

### API Endpoints
- `POST /upload` - Upload documents
- `POST /chat` - Chat with AI about documents
- `GET /health` - Health check
- `POST /set-openai-key` - Configure API key

## 🎨 Customization

### Branding
- Replace `frontend/public/LOGO.jpg` with your logo
- Replace `frontend/public/INTRO.mp4` with your intro video
- Update colors in theme configuration

### Styling
- Main colors: `#1B1B1B`, `#242424`, `#374151`
- Accent colors: `#9CA3AF`, `#6B7280`
- Typography: Inter font family

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build frontend --no-cache
```

## 📚 Development

### Local Development
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start
```

### Testing
```bash
# Backend tests
cd backend && python -m pytest

# Frontend tests
cd frontend && npm test
```

## 🌐 Production Deployment

### 1. Production Environment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Nginx Configuration
- Use provided `nginx.prod.conf`
- Configure SSL certificates
- Set up domain and DNS

### 3. Environment Variables
```bash
NODE_ENV=production
REACT_APP_API_URL=https://your-domain.com/api
OPENAI_API_KEY=your-production-key
```

## 📊 Monitoring

### Health Checks
```bash
curl http://localhost:8000/health
docker-compose ps
docker-compose logs -f
```

### Performance
- RAG engine with configurable chunk size
- OpenAI API integration with fallback
- Automatic document processing

## 🚨 Troubleshooting

### Common Issues
1. **Port conflicts**: Check if ports 3000/8000 are free
2. **API key issues**: Verify OpenAI configuration
3. **Frontend not loading**: Rebuild frontend container
4. **File upload errors**: Check file size and format

### Logs
```bash
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# All logs
docker-compose logs -f
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Check the [Deployment Guide](DEPLOYMENT.md)
- Review [troubleshooting section](#-troubleshooting)
- Open an issue on GitHub

---

**NEXUS Platform** - Where intelligence meets your documents 🚀

Built with ❤️ using React, FastAPI, and OpenAI


