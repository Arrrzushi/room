FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    ffmpeg \
    espeak-ng \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies with increased timeout and retries
RUN pip install --no-cache-dir --timeout 1000 --retries 10 -r requirements.txt

# Create necessary directories
RUN mkdir -p \
    room_rag/storage \
    room_translate/models \
    room_voice/models \
    static/audio

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]