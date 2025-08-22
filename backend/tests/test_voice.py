import pytest
import os
import numpy as np
from pathlib import Path
import shutil
from room_voice.processor import RoomVoice

@pytest.fixture
def voice_processor():
    """Create a test voice processor instance."""
    processor = RoomVoice()
    yield processor
    # Cleanup after tests
    if os.path.exists("static/audio"):
        shutil.rmtree("static/audio")

def create_test_audio(duration_seconds=2, sample_rate=16000):
    """Create test audio data."""
    # Generate a simple sine wave
    t = np.linspace(0, duration_seconds, int(sample_rate * duration_seconds))
    audio = np.sin(2 * np.pi * 440 * t)  # 440 Hz sine wave
    # Convert to 16-bit PCM
    audio = (audio * 32767).astype(np.int16)
    return audio.tobytes()

def test_speech_to_text(voice_processor):
    """Test speech-to-text functionality."""
    # Create test audio
    audio_data = create_test_audio()
    
    # Test transcription
    text = voice_processor.speech_to_text(audio_data)
    assert text is not None
    assert isinstance(text, str)

def test_text_to_speech_english(voice_processor):
    """Test text-to-speech functionality for English."""
    text = "Hello, how are you?"
    
    # Test TTS
    audio_path = voice_processor.text_to_speech(text, lang="en")
    assert audio_path is not None
    assert audio_path.startswith("/static/audio/")
    assert Path("static/audio").exists()

def test_text_to_speech_hindi(voice_processor):
    """Test text-to-speech functionality for Hindi."""
    text = "नमस्ते, आप कैसे हैं?"
    
    # Test TTS
    audio_path = voice_processor.text_to_speech(text, lang="hi")
    assert audio_path is not None
    assert audio_path.startswith("/static/audio/")
    assert Path("static/audio").exists()

def test_cleanup_old_files(voice_processor):
    """Test cleanup of old audio files."""
    # Create some test files
    text = "Test audio"
    voice_processor.text_to_speech(text, lang="en")
    
    # Run cleanup
    voice_processor.cleanup_old_files(max_age_hours=0)
    
    # Check if files are cleaned up
    files = list(Path("static/audio").glob("*.wav"))
    assert len(files) == 0

def test_supported_languages(voice_processor):
    """Test getting supported languages."""
    languages = voice_processor.get_supported_languages()
    assert isinstance(languages, dict)
    assert "en" in languages
    assert "hi" in languages
    assert languages["en"] == "English"
    assert languages["hi"] == "Hindi"




