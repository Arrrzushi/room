import os
from pathlib import Path
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline
import regex as re
from typing import Dict, List, Optional

class RoomTranslator:
    """
    Room's multilingual translation engine using IndicTrans2.
    """
    
    def __init__(self):
        """Initialize the translator with necessary models."""
        # Initialize models path
        self.models_path = Path("room_translate/models")
        self.models_path.mkdir(parents=True, exist_ok=True)
        
        # Initialize translation models
        self.en2hi_model = None
        self.hi2en_model = None
        self.en2hi_tokenizer = None
        self.hi2en_tokenizer = None
        
        # Initialize language detection
        self.lang_detector = pipeline("text-classification", model="papluca/xlm-roberta-base-language-detection")
        
        # Regex patterns for text normalization
        self.patterns = {
            "multiple_spaces": re.compile(r"\s+"),
            "spaces_around_punctuation": re.compile(r"\s*([,.!?])\s*"),
            "normalize_quotes": re.compile(r'["""]'),
            "normalize_apostrophes": re.compile(r"['']"),
            "devanagari": re.compile(r'[\u0900-\u097F]'),
        }

    def _load_en2hi_model(self):
        """Load English to Hindi translation model."""
        if self.en2hi_model is None:
            model_name = "ai4bharat/indictrans2-en-indic-dist-200M"
            self.en2hi_tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.en2hi_model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            self.en2hi_model.eval()
            if torch.cuda.is_available():
                self.en2hi_model.to("cuda")

    def _load_hi2en_model(self):
        """Load Hindi to English translation model."""
        if self.hi2en_model is None:
            model_name = "ai4bharat/indictrans2-indic-en-dist-200M"
            self.hi2en_tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.hi2en_model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            self.hi2en_model.eval()
            if torch.cuda.is_available():
                self.hi2en_model.to("cuda")

    def _normalize_text(self, text: str) -> str:
        """Normalize text by cleaning up spaces and punctuation."""
        text = text.strip()
        text = self.patterns["multiple_spaces"].sub(" ", text)
        text = self.patterns["spaces_around_punctuation"].sub(r"\1 ", text)
        text = self.patterns["normalize_quotes"].sub('"', text)
        text = self.patterns["normalize_apostrophes"].sub("'", text)
        return text.strip()

    def detect_language(self, text: str) -> str:
        """
        Detect the language of input text.
        
        Args:
            text: Input text to detect language
            
        Returns:
            str: Language code ('en' or 'hi')
        """
        # First try using Devanagari script detection
        if self.patterns["devanagari"].search(text):
            return 'hi'
            
        # Fallback to model-based detection
        result = self.lang_detector(text)[0]
        lang_code = result['label'].lower()
        
        # Map language codes
        if lang_code in ['hin', 'hi', 'hindi']:
            return 'hi'
        return 'en'

    def translate_to_english(self, text: str) -> str:
        """
        Translate Hindi text to English.
        
        Args:
            text: Hindi text to translate
            
        Returns:
            str: English translation
        """
        if self.detect_language(text) == 'en':
            return text
            
        self._load_hi2en_model()
        
        # Normalize input text
        text = self._normalize_text(text)
        
        # Prepare input
        inputs = self.hi2en_tokenizer(text, return_tensors="pt", padding=True)
        if torch.cuda.is_available():
            inputs = {k: v.to("cuda") for k, v in inputs.items()}
            
        # Generate translation
        with torch.no_grad():
            outputs = self.hi2en_model.generate(**inputs, max_length=512)
            
        # Decode and normalize translation
        translation = self.hi2en_tokenizer.decode(outputs[0], skip_special_tokens=True)
        return self._normalize_text(translation)

    def translate_to_hindi(self, text: str) -> str:
        """
        Translate English text to Hindi.
        
        Args:
            text: English text to translate
            
        Returns:
            str: Hindi translation
        """
        if self.detect_language(text) == 'hi':
            return text
            
        self._load_en2hi_model()
        
        # Normalize input text
        text = self._normalize_text(text)
        
        # Prepare input
        inputs = self.en2hi_tokenizer(text, return_tensors="pt", padding=True)
        if torch.cuda.is_available():
            inputs = {k: v.to("cuda") for k, v in inputs.items()}
            
        # Generate translation
        with torch.no_grad():
            outputs = self.en2hi_model.generate(**inputs, max_length=512)
            
        # Decode and normalize translation
        translation = self.en2hi_tokenizer.decode(outputs[0], skip_special_tokens=True)
        return self._normalize_text(translation)

    def translate(self, text: str, target_lang: str) -> str:
        """
        Translate text to target language.
        
        Args:
            text: Text to translate
            target_lang: Target language code ('en' or 'hi')
            
        Returns:
            str: Translated text
        """
        if target_lang == 'en':
            return self.translate_to_english(text)
        elif target_lang == 'hi':
            return self.translate_to_hindi(text)
        else:
            raise ValueError(f"Unsupported target language: {target_lang}")

    def batch_translate(self, texts: List[str], target_lang: str) -> List[str]:
        """
        Translate a batch of texts to target language.
        
        Args:
            texts: List of texts to translate
            target_lang: Target language code ('en' or 'hi')
            
        Returns:
            List[str]: List of translated texts
        """
        return [self.translate(text, target_lang) for text in texts]