FROM python:3.9-slim

WORKDIR /app

# Install system deps (add curl for healthcheck)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Optional: docs only; Railway sets PORT env var at runtime
EXPOSE 8080

# Health check (uses PORT provided by Railway)
HEALTHCHECK CMD python -c "import urllib.request,os;urllib.request.urlopen(f'http://localhost:{os.environ.get(\"PORT\", \"8080\")}/health')" || exit 1


# IMPORTANT: bind to ${PORT}, no --reload in prod
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
