FROM python:3.9-slim

WORKDIR /app

# Install system dependencies (add curl for healthcheck)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Document the port (Railway sets $PORT at runtime)
EXPOSE 8080

# Health check (uses the dynamic $PORT)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -fsS "http://localhost:${PORT}/health" || exit 1

# Run the application (bind to $PORT, no --reload in prod)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
