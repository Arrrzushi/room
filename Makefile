# Room AI Assistant Makefile

.PHONY: help install-dev install-prod start-dev start-prod stop clean test lint format

help: ## Show this help message
	@echo "Room AI Assistant - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install-dev: ## Install development dependencies
	@echo "Installing development dependencies..."
	cd backend && python -m venv venv
	cd backend && source venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

install-prod: ## Install production dependencies
	@echo "Installing production dependencies..."
	docker-compose build

start-dev: ## Start development servers
	@echo "Starting development servers..."
	@echo "Starting backend..."
	cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000 &
	@echo "Starting frontend..."
	cd frontend && npm start &
	@echo "Development servers started!"
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"

start-prod: ## Start production servers with Docker
	@echo "Starting production servers..."
	docker-compose up -d
	@echo "Production servers started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"

stop: ## Stop all servers
	@echo "Stopping servers..."
	docker-compose down
	@echo "Servers stopped!"

clean: ## Clean up generated files and containers
	@echo "Cleaning up..."
	docker-compose down -v --remove-orphans
	docker system prune -f
	cd backend && rm -rf venv __pycache__ room_rag/storage/* room_translate/models/* room_voice/models/* static/audio/*
	cd frontend && rm -rf node_modules build
	@echo "Cleanup complete!"

test: ## Run tests
	@echo "Running tests..."
	cd backend && source venv/bin/activate && pytest -v
	cd frontend && npm test -- --watchAll=false

lint: ## Run linting
	@echo "Running linting..."
	cd backend && source venv/bin/activate && flake8 .
	cd frontend && npm run lint

format: ## Format code
	@echo "Formatting code..."
	cd backend && source venv/bin/activate && black . && isort .
	cd frontend && npm run format

logs: ## Show logs
	@echo "Showing logs..."
	docker-compose logs -f

health: ## Check service health
	@echo "Checking service health..."
	@curl -f http://localhost:8000/health || echo "Backend not responding"
	@curl -f http://localhost:3000 || echo "Frontend not responding"

setup: install-dev ## Setup development environment
	@echo "Development environment setup complete!"
	@echo "Run 'make start-dev' to start development servers"

