#!/usr/bin/env python3
"""
Room AI Assistant Health Check

This script checks the health of all Room application services.
"""

import requests
import time
import sys
from pathlib import Path

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"
HEALTH_ENDPOINT = f"{BACKEND_URL}/health"

def check_backend():
    """Check if the backend service is healthy."""
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend: Healthy - {data.get('message', 'Service running')}")
            return True
        else:
            print(f"❌ Backend: Unhealthy - Status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend: Connection failed - {e}")
        return False

def check_frontend():
    """Check if the frontend service is accessible."""
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print(f"✅ Frontend: Accessible - Status {response.status_code}")
            return True
        else:
            print(f"❌ Frontend: Error - Status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend: Connection failed - {e}")
        return False

def check_storage():
    """Check if storage directories exist and are writable."""
    base_dir = Path(__file__).parent
    storage_paths = [
        base_dir / "backend" / "room_rag" / "storage",
        base_dir / "backend" / "room_translate" / "models",
        base_dir / "backend" / "room_voice" / "models",
        base_dir / "backend" / "static" / "audio"
    ]
    
    all_good = True
    for path in storage_paths:
        try:
            path.mkdir(parents=True, exist_ok=True)
            # Test write access
            test_file = path / ".test_write"
            test_file.write_text("test")
            test_file.unlink()
            print(f"✅ Storage: {path.name} - Writable")
        except Exception as e:
            print(f"❌ Storage: {path.name} - Error: {e}")
            all_good = False
    
    return all_good

def check_dependencies():
    """Check if required Python packages are installed."""
    required_packages = [
        "fastapi",
        "uvicorn",
        "torch",
        "transformers",
        "faiss-cpu",
        "sentence-transformers",
        "whisper",
        "TTS"
    ]
    
    all_good = True
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
            print(f"✅ Package: {package} - Installed")
        except ImportError:
            print(f"❌ Package: {package} - Not installed")
            all_good = False
    
    return all_good

def main():
    """Run all health checks."""
    print("🏥 Room AI Assistant Health Check")
    print("=" * 40)
    
    checks = [
        ("Backend Service", check_backend),
        ("Frontend Service", check_frontend),
        ("Storage Directories", check_storage),
        ("Python Dependencies", check_dependencies)
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n🔍 Checking {name}...")
        result = check_func()
        results.append((name, result))
        time.sleep(1)  # Small delay between checks
    
    print("\n" + "=" * 40)
    print("📊 Health Check Summary:")
    
    all_passed = True
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {name}: {status}")
        if not result:
            all_passed = False
    
    print("\n" + "=" * 40)
    if all_passed:
        print("🎉 All health checks passed! Room is ready to use.")
        sys.exit(0)
    else:
        print("⚠️  Some health checks failed. Please review the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main()

