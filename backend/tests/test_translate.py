import pytest
from room_translate.translator import RoomTranslator

@pytest.fixture
def translator():
    """Create a test translator instance."""
    return RoomTranslator()

def test_language_detection(translator):
    """Test language detection functionality."""
    # Test English text
    text_en = "Hello, how are you?"
    assert translator.detect_language(text_en) == "en"
    
    # Test Hindi text
    text_hi = "नमस्ते, आप कैसे हैं?"
    assert translator.detect_language(text_hi) == "hi"

def test_english_to_hindi_translation(translator):
    """Test English to Hindi translation."""
    text = "Hello, how are you?"
    translation = translator.translate_to_hindi(text)
    assert translation is not None
    assert len(translation) > 0
    assert translator.detect_language(translation) == "hi"

def test_hindi_to_english_translation(translator):
    """Test Hindi to English translation."""
    text = "नमस्ते, आप कैसे हैं?"
    translation = translator.translate_to_english(text)
    assert translation is not None
    assert len(translation) > 0
    assert translator.detect_language(translation) == "en"

def test_batch_translation(translator):
    """Test batch translation functionality."""
    texts = [
        "Hello, how are you?",
        "What is your name?",
        "Nice to meet you!"
    ]
    translations = translator.batch_translate(texts, "hi")
    assert len(translations) == len(texts)
    for translation in translations:
        assert translation is not None
        assert len(translation) > 0
        assert translator.detect_language(translation) == "hi"

def test_text_normalization(translator):
    """Test text normalization functionality."""
    # Test multiple spaces
    text = "Hello   world  !"
    normalized = translator._normalize_text(text)
    assert normalized == "Hello world!"
    
    # Test punctuation spacing
    text = "Hello , world !"
    normalized = translator._normalize_text(text)
    assert normalized == "Hello, world!"
    
    # Test quotes
    text = "He said "hello" to me"
    normalized = translator._normalize_text(text)
    assert normalized == 'He said "hello" to me'




