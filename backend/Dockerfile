FROM python:3.9-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y \
    gcc g++ curl \
 && rm -rf /var/lib/apt/lists/*

# Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App code
COPY . .

# Document port (Railway sets $PORT at runtime)
EXPOSE 8080

# Healthcheck using dynamic $PORT
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -fsS "http://localhost:${PORT}/health" || exit 1

# 🔑 Use SHELL-FORM so $PORT expands
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port $PORT"
