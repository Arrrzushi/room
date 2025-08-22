from typing import Dict, Optional

class RoomTranslator:
    """
    Room's translation engine - simplified version.
    """
    
    def __init__(self):
        """Initialize the translator."""
        # Simple translation dictionary for common phrases
        self.translations = {
            "hello": "नमस्ते",
            "how are you": "कैसे हो आप",
            "thank you": "धन्यवाद",
            "goodbye": "अलविदा",
            "yes": "हाँ",
            "no": "नहीं",
            "please": "कृपया",
            "sorry": "माफ़ कीजिए",
            "welcome": "स्वागत है",
            "good morning": "सुप्रभात",
            "good night": "शुभ रात्रि"
        }
        
        print("Translator initialized (basic mode)")
    
    def translate(self, text: str, source_lang: str = "en", target_lang: str = "hi") -> str:
        """
        Translate text between languages.
        
        Args:
            text: Text to translate
            source_lang: Source language code
            target_lang: Target language code
            
        Returns:
            str: Translated text
        """
        try:
            if source_lang == "en" and target_lang == "hi":
                return self._english_to_hindi(text)
            elif source_lang == "hi" and target_lang == "en":
                return self._hindi_to_english(text)
            else:
                return f"Translation from {source_lang} to {target_lang} not yet supported"
                
        except Exception as e:
            return f"Translation error: {str(e)}"
    
    def _english_to_hindi(self, text: str) -> str:
        """Translate English to Hindi (basic implementation)."""
        text_lower = text.lower()
        
        # Check for exact matches
        for english, hindi in self.translations.items():
            if english in text_lower:
                return f"{text} ({hindi})"
        
        # For now, return the original text with a note
        return f"{text} (Hindi translation coming soon!)"
    
    def _hindi_to_english(self, text: str) -> str:
        """Translate Hindi to English (basic implementation)."""
        # For now, return the original text with a note
        return f"{text} (English translation coming soon!)"
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Get supported languages."""
        return {
            "en": "English",
            "hi": "Hindi (basic support)"
        }
    
    def detect_language(self, text: str) -> str:
        """Detect the language of the text."""
        # Simple detection based on Devanagari script
        if any('\u0900' <= char <= '\u097F' for char in text):
            return "hi"
        else:
            return "en"