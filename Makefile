# NEXUS Platform Makefile
# Commands for managing the NEXUS Intelligent Document Analysis Platform

.PHONY: help build up down restart logs clean test lint format

# Default target
help:
	@echo "🚀 NEXUS Platform - Available Commands:"
	@echo ""
	@echo "📦 Build & Deploy:"
	@echo "  build     - Build all Docker images"
	@echo "  up        - Start all services"
	@echo "  down      - Stop all services"
	@echo "  restart   - Restart all services"
	@echo ""
	@echo "🔍 Monitoring:"
	@echo "  logs      - Show service logs"
	@echo "  status    - Show service status"
	@echo "  health    - Check service health"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  clean     - Remove all containers and images"
	@echo "  prune     - Clean up unused Docker resources"
	@echo ""
	@echo "🛠️  Development:"
	@echo "  test      - Run tests"
	@echo "  lint      - Run linting"
	@echo "  format    - Format code"
	@echo ""
	@echo "📚 Documentation:"
	@echo "  docs      - Generate documentation"

# Build all Docker images
build:
	@echo "🔨 Building NEXUS Platform images..."
	docker-compose build --no-cache

# Start all services
up:
	@echo "🚀 Starting NEXUS Platform..."
	docker-compose up -d
	@echo "✅ NEXUS Platform is starting up!"
	@echo "📍 Frontend: http://localhost:3000"
	@echo "📍 Backend: http://localhost:8000"

# Stop all services
down:
	@echo "🛑 Stopping NEXUS Platform..."
	docker-compose down
	@echo "✅ NEXUS Platform stopped"

# Restart all services
restart: down up

# Show service logs
logs:
	@echo "📋 NEXUS Platform logs:"
	docker-compose logs -f

# Show service status
status:
	@echo "📊 NEXUS Platform status:"
	docker-compose ps

# Check service health
health:
	@echo "🏥 Checking NEXUS Platform health..."
	@curl -f http://localhost:8000/health || echo "❌ Backend is not healthy"

# Clean up all containers and images
clean:
	@echo "🧹 Cleaning up NEXUS Platform..."
	docker-compose down -v --rmi all
	docker system prune -f
	@echo "✅ Cleanup complete"

# Clean up unused Docker resources
prune:
	@echo "🧹 Pruning unused Docker resources..."
	docker system prune -f
	@echo "✅ Pruning complete"

# Run tests
test:
	@echo "🧪 Running NEXUS Platform tests..."
	cd backend && python -m pytest tests/ -v

# Run linting
lint:
	@echo "🔍 Running NEXUS Platform linting..."
	cd backend && flake8 . --max-line-length=100
	cd frontend && npm run lint

# Format code
format:
	@echo "✨ Formatting NEXUS Platform code..."
	cd backend && black . && isort .
	cd frontend && npm run format

# Generate documentation
docs:
	@echo "📚 Generating NEXUS Platform documentation..."
	@echo "Documentation generation coming soon..."

# Quick start (build and start)
start: build up
	@echo "🎉 NEXUS Platform is ready!"
	@echo "📍 Frontend: http://localhost:3000"
	@echo "📍 Backend: http://localhost:8000"
	@echo "📍 Health: http://localhost:8000/health"

# Development mode
dev:
	@echo "🛠️  Starting NEXUS Platform in development mode..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Development environment ready!"

