# 🚀 NEXUS Platform - Complete Deployment Guide

## 📋 Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git** (for version control)
- **Node.js** (version 18+ for local development)
- **Python** (version 3.9+ for local development)

## 🏗️ Project Structure

```
nexus/
├── backend/                 # FastAPI backend
│   ├── main.py            # Main application
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile        # Backend container
├── frontend/              # React frontend
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── package.json      # Node dependencies
│   └── Dockerfile        # Frontend container
├── uploads/              # Document storage
├── docker-compose.yml    # Service orchestration
├── .env                  # Environment variables
├── Makefile             # Development commands
└── README.md            # Project documentation
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone your repository
git clone <your-repo-url>
cd nexus

# Copy environment file
cp env.example .env

# Edit .env with your API keys
nano .env
```

### 2. Configure Environment

```bash
# .env file
OPENAI_API_KEY=your-api-key-here
OPENAI_BASE_URL=https://api.a4f.co/v1
API_HOST=0.0.0.0
API_PORT=8000
```

### 3. Start Services

```bash
# Build and start all services
make start

# Or manually:
docker-compose up -d --build
```

### 4. Access Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

## 🐳 Docker Commands

### Build Images
```bash
# Build all services
docker-compose build --no-cache

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Manage Services
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

### Cleanup
```bash
# Remove containers and images
docker-compose down -v --rmi all

# Clean unused resources
docker system prune -f
```

## 🛠️ Development Commands

```bash
# Start development environment
make dev

# Run tests
make test

# Code formatting
make format

# Linting
make lint

# Show service status
make status

# Check health
make health
```

## 🌐 Production Deployment

### 1. Environment Setup

```bash
# Production .env
NODE_ENV=production
REACT_APP_API_URL=https://your-domain.com/api
OPENAI_API_KEY=your-production-api-key
OPENAI_BASE_URL=https://api.a4f.co/v1
```

### 2. Build Production Images

```bash
# Build optimized images
docker-compose -f docker-compose.prod.yml build --no-cache

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/nexus
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📱 Frontend Customization

### Logo and Branding
- Replace `frontend/public/LOGO.jpg` with your logo
- Replace `frontend/public/INTRO.mp4` with your intro video
- Update colors in `src/App.js` theme configuration

### Styling
- Main colors: `#1B1B1B`, `#242424`, `#374151`
- Accent colors: `#9CA3AF`, `#6B7280`
- Typography: Inter font family

## 🔧 Backend Configuration

### API Endpoints
- `POST /upload` - File upload
- `POST /chat` - Document analysis
- `GET /health` - Health check
- `POST /set-openai-key` - Configure API key

### Supported File Types
- PDF, TXT, DOC, DOCX
- Max file size: 50MB
- Automatic text extraction and chunking

## 📊 Monitoring and Logs

### Health Checks
```bash
# Check backend health
curl http://localhost:8000/health

# Check service status
docker-compose ps

# View service logs
docker-compose logs backend
docker-compose logs frontend
```

### Performance
- RAG engine with configurable chunk size
- OpenAI API integration with fallback
- Automatic document processing

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :8000
   
   # Stop conflicting services
   docker stop $(docker ps -q)
   ```

2. **API Key Issues**
   ```bash
   # Verify API key is set
   curl -X POST http://localhost:8000/set-openai-key \
     -H "Content-Type: application/json" \
     -d '{"api_key":"your-key","base_url":"https://api.a4f.co/v1"}'
   ```

3. **Frontend Not Loading**
   ```bash
   # Rebuild frontend
   docker-compose build frontend --no-cache
   docker-compose up -d frontend
   ```

### Log Analysis
```bash
# Follow backend logs
docker-compose logs -f backend

# Follow frontend logs
docker-compose logs -f frontend

# Check for errors
docker-compose logs | grep -i error
```

## 🔒 Security Considerations

- Keep API keys secure in `.env` files
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regular security updates for dependencies
- Monitor for suspicious activity

## 📈 Scaling

### Horizontal Scaling
```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
    environment:
      - MAX_WORKERS=8
```

### Load Balancing
- Use Nginx or HAProxy for load balancing
- Implement health checks
- Consider Redis for session management

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] API keys set and tested
- [ ] Docker images built successfully
- [ ] Services running and healthy
- [ ] Frontend accessible
- [ ] File uploads working
- [ ] Chat functionality tested
- [ ] Logs monitored for errors
- [ ] Security measures implemented
- [ ] Backup strategy in place

## 📞 Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify environment: `docker-compose config`
3. Test endpoints: `curl http://localhost:8000/health`
4. Check resources: `docker system df`

---

**NEXUS Platform** - Where intelligence meets your documents 🚀
