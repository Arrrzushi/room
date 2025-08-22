#!/usr/bin/env python3
"""
NEXUS Platform Startup Script
Starts the NEXUS Intelligent Document Analysis Platform
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def print_banner():
    """Print the NEXUS startup banner."""
    print("=" * 60)
    print("🚀 NEXUS - Intelligent Document Analysis Platform")
    print("=" * 60)
    print("Starting services...")
    print()

def check_docker():
    """Check if Docker is running."""
    try:
        subprocess.run(["docker", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def start_services():
    """Start the NEXUS services using Docker Compose."""
    try:
        print("🐳 Starting NEXUS services...")
        subprocess.run(["docker-compose", "up", "-d"], check=True)
        print("✅ Services started successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start services: {e}")
        return False

def check_health():
    """Check the health of running services."""
    print("\n🏥 Checking service health...")
    
    # Wait a bit for services to start
    time.sleep(5)
    
    try:
        # Check backend health
        result = subprocess.run(
            ["curl", "-f", "http://localhost:8000/health"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            print("✅ Backend is healthy")
        else:
            print("❌ Backend health check failed")
            return False
            
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    return True

def show_status():
    """Show the status of running services."""
    print("\n📊 Service Status:")
    print("-" * 30)
    
    try:
        result = subprocess.run(
            ["docker-compose", "ps"],
            capture_output=True,
            text=True,
            check=True
        )
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to get service status: {e}")

def main():
    """Main startup function."""
    print_banner()
    
    # Check Docker
    if not check_docker():
        print("❌ Docker is not running or not installed!")
        print("Please start Docker and try again.")
        sys.exit(1)
    
    # Start services
    if not start_services():
        print("❌ Failed to start services!")
        sys.exit(1)
    
    # Check health
    if not check_health():
        print("❌ Services are not healthy!")
        sys.exit(1)
    
    # Show status
    show_status()
    
    print("\n🎉 NEXUS Platform is ready!")
    print("📍 Frontend: http://localhost:3000")
    print("📍 Backend API: http://localhost:8000")
    print("📍 Health Check: http://localhost:8000/health")
    print("\nPress Ctrl+C to stop services")
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping NEXUS services...")
        subprocess.run(["docker-compose", "down"])
        print("✅ Services stopped. Goodbye!")

if __name__ == "__main__":
    main()

