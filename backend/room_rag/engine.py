import os
import asyncio
from pathlib import Path
from typing import List, Dict, Optional
import numpy as np
import PyPDF2
import io
import re
import openai
from openai import AsyncOpenAI

class RoomRAG:
    """
    Room's RAG (Retrieval-Augmented Generation) engine - OpenAI-powered version.
    """
    
    def __init__(self):
        """Initialize the RAG engine."""
        self.storage_path = Path("room_rag/storage")
        self.storage_path.mkdir(parents=True, exist_ok=True)
        
        # Document storage
        self.documents = []
        self.text_chunks = []
        
        # OpenAI client
        self.openai_client = None
        self.model = "gpt-4o-mini"  # Default model
        self.base_url = None
        
        # Initialize OpenAI if API key is available
        self._init_openai()
        
        print("RAG engine initialized (OpenAI-powered mode)")
    
    def _init_openai(self):
        """Initialize OpenAI client if API key is available."""
        api_key = os.getenv("OPENAI_API_KEY")
        base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
        
        if api_key:
            try:
                # Create client with proper configuration
                if base_url != "https://api.openai.com/v1":
                    # For custom base URLs, use specific configuration
                    self.openai_client = AsyncOpenAI(
                        api_key=api_key,
                        base_url=base_url,
                        max_retries=3
                    )
                    self.base_url = base_url
                    # Use provider prefix for a4f.co
                    if "a4f.co" in base_url:
                        self.model = "provider-3/gpt-4o-mini"
                else:
                    # For standard OpenAI, use default configuration
                    self.openai_client = AsyncOpenAI(api_key=api_key)
                    self.model = "gpt-4o-mini"
                
                print(f"✅ OpenAI client initialized successfully with base URL: {base_url}")
                print(f"✅ Using model: {self.model}")
            except Exception as e:
                print(f"❌ Failed to initialize OpenAI client: {e}")
                self.openai_client = None
        else:
            print("⚠️  No OpenAI API key found. Using basic mode.")
            self.openai_client = None
    
    def extract_text_from_pdf(self, content: bytes) -> str:
        """Extract text content from PDF bytes."""
        try:
            pdf_file = io.BytesIO(content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text_content = []
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                if page_text.strip():
                    text_content.append(f"Page {page_num + 1}: {page_text.strip()}")
            
            return "\n\n".join(text_content)
        except Exception as e:
            print(f"Error extracting PDF text: {e}")
            return ""
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove PDF artifacts
        text = re.sub(r'%PDF.*?endobj', '', text)
        text = re.sub(r'obj.*?endobj', '', text)
        # Clean up
        text = text.strip()
        return text
    
    def chunk_text(self, text: str, chunk_size: int = 2000) -> List[str]:
        """Split text into manageable chunks for better processing."""
        words = text.split()
        chunks = []
        current_chunk = []
        current_size = 0
        
        for word in words:
            if current_size + len(word) + 1 > chunk_size and current_chunk:
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_size = len(word)
            else:
                current_chunk.append(word)
                current_size += len(word) + 1
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks

    async def process_document(self, file) -> str:
        """Process an uploaded document."""
        try:
            # Read file content
            content = await file.read()
            
            if hasattr(file, 'filename'):
                filename = file.filename
            else:
                filename = "unknown.txt"
            
            # Extract text based on file type
            if filename.lower().endswith('.pdf'):
                raw_text = self.extract_text_from_pdf(content)
                if not raw_text:
                    return f"Error: Could not extract text from PDF '{filename}'. The file might be corrupted or image-based."
            else:
                # For text files
                raw_text = content.decode('utf-8', errors='ignore')
            
            # Clean the text
            cleaned_text = self.clean_text(raw_text)
            if not cleaned_text or len(cleaned_text) < 50:
                return f"Warning: Document '{filename}' appears to contain very little readable text. It might be an image-based PDF or corrupted file."
            
            # Create text chunks
            chunks = self.chunk_text(cleaned_text)
            
            # Store document
            doc_info = {
                    "filename": filename,
                "content": cleaned_text,
                "chunks": chunks,
                "size": len(content),
                "chunk_count": len(chunks)
            }
            
            self.documents.append(doc_info)
            self.text_chunks.extend(chunks)
            
            return f"Document '{filename}' processed successfully! Extracted {len(chunks)} text chunks."
            
        except Exception as e:
            raise Exception(f"Error processing document: {str(e)}")

    def find_relevant_chunks(self, query: str, top_k: int = 5) -> List[str]:
        """Find the most relevant text chunks for a query using improved relevance scoring."""
        query_lower = query.lower()
        query_words = set(query_lower.split())
        
        # Remove common stop words for better matching
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'what', 'when', 'where', 'why', 'how', 'who', 'which'}
        query_words = query_words - stop_words
        
        if not query_words:
            return self.text_chunks[:top_k]
        
        # Calculate relevance scores
        chunk_scores = []
        for i, chunk in enumerate(self.text_chunks):
            chunk_lower = chunk.lower()
            chunk_words = set(chunk_lower.split())
            
            # Calculate multiple relevance factors
            common_words = query_words.intersection(chunk_words)
            word_overlap_score = len(common_words) / max(len(query_words), 1)
            
            # Phrase matching (exact phrase matches get higher scores)
            phrase_score = 0
            for word in query_words:
                if word in chunk_lower:
                    phrase_score += 1
            
            # Position bonus (chunks with query words near the beginning get higher scores)
            position_bonus = 0
            for word in query_words:
                if word in chunk_lower:
                    word_pos = chunk_lower.find(word)
                    if word_pos < len(chunk) * 0.3:  # First 30% of chunk
                        position_bonus += 0.2
            
            # Combined score
            total_score = word_overlap_score * 0.6 + phrase_score * 0.3 + position_bonus
            
            if total_score > 0:
                chunk_scores.append((total_score, chunk, i))
        
        # Sort by score and return top chunks
        chunk_scores.sort(key=lambda x: x[0], reverse=True)
        return [chunk for score, chunk, idx in chunk_scores[:top_k]]
    
    async def generate_intelligent_response(self, query: str, relevant_chunks: List[str]) -> str:
        """Generate an intelligent response using OpenAI GPT."""
        if not self.openai_client or not relevant_chunks:
            return self._fallback_response(query, relevant_chunks)
        
        try:
            # Prepare context from relevant chunks
            context = "\n\n".join([f"Context {i+1}: {chunk}" for i, chunk in enumerate(relevant_chunks)])
            
            # Create a comprehensive prompt
            system_prompt = """You are NEXUS, a sophisticated AI assistant that analyzes documents and provides clear, accurate answers. 
            
Your task is to:
1. Understand the user's question
2. Use the provided document context to answer accurately
3. Provide specific, relevant information
4. If the answer isn't in the context, say so clearly
5. Be helpful and conversational

Always base your answers on the document content provided. If you can't find specific information, acknowledge it and suggest what the user might ask instead."""

            user_prompt = f"""User Question: {query}

Document Context:
{context}

Please provide a clear, helpful answer based on the document content above. If the specific information isn't available in the context, let the user know and suggest alternative questions they could ask."""

            # Generate response using OpenAI
            response = await self.openai_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self._fallback_response(query, relevant_chunks)
    
    def _fallback_response(self, query: str, relevant_chunks: List[str]) -> str:
        """Fallback response when OpenAI is not available."""
        if not relevant_chunks:
            doc_names = [doc["filename"] for doc in self.documents]
            return f"I couldn't find specific information about '{query}' in your documents. However, I have these documents available: {', '.join(doc_names)}. Try asking about specific topics, concepts, or content that might be in these documents."
        
        # Provide a basic but more helpful response
        response = f"Based on your question about '{query}', I found some relevant information:\n\n"
        
        for i, chunk in enumerate(relevant_chunks, 1):
            # Truncate long chunks for readability
            if len(chunk) > 300:
                chunk = chunk[:300] + "..."
            response += f"{i}. {chunk}\n\n"
        
        response += "For more detailed and intelligent answers, please ensure your OpenAI API key is configured."
        return response
    
    async def get_response(self, query: str, language: str = "en") -> str:
        """Get an intelligent response based on the query and stored documents."""
        try:
            if not self.documents:
                return "I don't have any documents to work with yet. Please upload some documents first!"
            
            # Find relevant content
            relevant_chunks = self.find_relevant_chunks(query)
            
            # Check if OpenAI client is available (either from init or from manual setting)
            if not self.openai_client:
                # Try to reinitialize from environment variables
                self._init_openai()
            
            # Generate intelligent response
            if self.openai_client:
                try:
                    response = await self.generate_intelligent_response(query, relevant_chunks)
                    return response
                except Exception as e:
                    print(f"OpenAI API call failed: {e}")
                    # Fall back to basic response if API fails
                    return self._fallback_response(query, relevant_chunks)
            else:
                response = self._fallback_response(query, relevant_chunks)
                return response
            
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"
    
    def get_document_count(self) -> int:
        """Get the number of stored documents."""
        return len(self.documents)
    
    def get_document_info(self) -> List[Dict]:
        """Get information about stored documents."""
        return [
            {
                "filename": doc["filename"],
                "size": doc["size"],
                "chunk_count": doc["chunk_count"],
                "preview": doc["content"][:100] + "..." if len(doc["content"]) > 100 else doc["content"]
            }
            for doc in self.documents
        ]
    
    def clear_documents(self):
        """Clear all stored documents."""
        self.documents.clear()
        self.text_chunks.clear()
        return "All documents cleared successfully!"
    
    def set_openai_api_key(self, api_key: str, base_url: str = None):
        """Set OpenAI API key manually."""
        try:
            if base_url is None:
                base_url = "https://api.openai.com/v1"
            
            # Create client with proper configuration
            if base_url != "https://api.openai.com/v1":
                # For custom base URLs, use specific configuration
                self.openai_client = AsyncOpenAI(
                    api_key=api_key,
                    base_url=base_url,
                    max_retries=3
                )
                self.base_url = base_url
                # Use provider prefix for a4f.co
                if "a4f.co" in base_url:
                    self.model = "provider-3/gpt-4o-mini"
                    print(f"✅ Using a4f.co model: {self.model}")
            else:
                # For standard OpenAI, use default configuration
                self.openai_client = AsyncOpenAI(api_key=api_key)
                self.model = "gpt-4o-mini"
            
            print(f"✅ OpenAI client initialized with provided API key and base URL: {base_url}")
            return True
        except Exception as e:
            print(f"❌ Failed to initialize OpenAI client: {e}")
            return False