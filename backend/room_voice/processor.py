import os
import time
import numpy as np
import whisper
import torch
from TTS.api import TTS
from pathlib import Path
import tempfile
from typing import Optional, Tuple, Dict

class RoomVoice:
    """
    Room's voice processing engine using Whisper for STT and Coqui TTS for voice generation.
    """
    
    def __init__(self):
        """Initialize voice processing components."""
        # Initialize paths
        self.models_path = Path("room_voice/models")
        self.models_path.mkdir(parents=True, exist_ok=True)
        
        # Initialize Whisper for speech recognition
        self.whisper_model = whisper.load_model("base")
        
        # Initialize TTS models
        self.tts_en = None
        self.tts_hi = None
        
        # Create output directory for audio files
        self.output_dir = Path("static/audio")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Configure audio settings
        self.sample_rate = 16000
        self.no_speech_threshold = 0.5

    def _load_tts_models(self):
        """Load TTS models if not already loaded."""
        if self.tts_en is None:
            # Load English TTS with a friendly voice
            self.tts_en = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC")
            
        if self.tts_hi is None:
            # Load Hindi TTS
            self.tts_hi = TTS(model_name="tts_models/hi/fairseq/vits")

    def _normalize_audio(self, audio_data: bytes) -> np.ndarray:
        """
        Normalize audio data to float32 format.
        
        Args:
            audio_data: Raw audio bytes (16-bit PCM)
            
        Returns:
            np.ndarray: Normalized audio data
        """
        # Convert 16-bit PCM to float32 [-1, 1]
        audio = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32)
        audio = audio / 32768.0
        return audio

    def speech_to_text(self, audio_data: bytes) -> str:
        """
        Convert speech to text using Whisper.
        
        Args:
            audio_data: Raw audio bytes (16-bit PCM)
            
        Returns:
            str: Transcribed text
        """
        try:
            # Save audio data to temporary file
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_path = temp_file.name

            # Normalize audio
            audio = self._normalize_audio(audio_data)
            
            # Transcribe audio
            result = self.whisper_model.transcribe(
                audio,
                language="en",  # Auto-detect between English and Hindi
                task="transcribe",
                no_speech_threshold=self.no_speech_threshold
            )
            
            # Clean up temporary file
            os.unlink(temp_path)
            
            return result["text"].strip()
            
        except Exception as e:
            raise Exception(f"Error in speech recognition: {str(e)}")

    def text_to_speech(self, text: str, lang: str = "en") -> str:
        """
        Convert text to speech using appropriate TTS model.
        
        Args:
            text: Text to convert to speech
            lang: Language code ('en' or 'hi')
            
        Returns:
            str: Path to generated audio file
        """
        try:
            self._load_tts_models()
            
            # Generate unique filename
            filename = f"tts_{hash(text)}_{lang}.wav"
            output_path = self.output_dir / filename
            
            # Select appropriate TTS model
            tts_model = self.tts_hi if lang == "hi" else self.tts_en
            
            # Generate speech
            tts_model.tts_to_file(
                text=text,
                file_path=str(output_path),
                speaker=tts_model.speakers[0] if tts_model.speakers else None
            )
            
            # Return relative path for serving
            return f"/static/audio/{filename}"
            
        except Exception as e:
            raise Exception(f"Error in text-to-speech: {str(e)}")

    def cleanup_old_files(self, max_age_hours: int = 24):
        """
        Clean up old audio files.
        
        Args:
            max_age_hours: Maximum age of files to keep (in hours)
        """
        try:
            current_time = time.time()
            for file in self.output_dir.glob("*.wav"):
                if (current_time - file.stat().st_mtime) > (max_age_hours * 3600):
                    file.unlink()
        except Exception as e:
            print(f"Error cleaning up files: {str(e)}")

    def get_supported_languages(self) -> Dict[str, str]:
        """
        Get list of supported languages.
        
        Returns:
            Dict[str, str]: Dictionary of language codes and names
        """
        return {
            "en": "English",
            "hi": "Hindi"
        }