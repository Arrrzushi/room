import os
import time
import numpy as np
import faiss
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from transformers import AutoTokenizer, AutoModel
import torch

class RoomRAG:
    """
    Room's RAG (Retrieval-Augmented Generation) engine using FAISS for vector storage.
    """
    
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        """
        Initialize the RAG engine.
        
        Args:
            model_name: The name of the sentence transformer model to use for embeddings.
        """
        self.model_name = model_name
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        
        # Initialize FAISS index
        self.embedding_dim = 384  # Dimension for all-MiniLM-L6-v2
        self.index = faiss.IndexFlatL2(self.embedding_dim)
        
        # Store document chunks and metadata
        self.documents: List[Dict] = []
        self.storage_dir = Path("room_rag/storage")
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        
        self.index_path = self.storage_dir / "faiss.index"
        self.docs_path = self.storage_dir / "documents.json"
        
        # Load existing data if available
        self._load_data()

    def _load_data(self):
        """Load existing document store and FAISS index if available."""
        if self.docs_path.exists():
            with open(self.docs_path, 'r', encoding='utf-8') as f:
                self.documents = json.load(f)
        
        if self.index_path.exists():
            self.index = faiss.read_index(str(self.index_path))

    def _save_data(self):
        """Save document store and FAISS index."""
        with open(self.docs_path, 'w', encoding='utf-8') as f:
            json.dump(self.documents, f, ensure_ascii=False, indent=2)
        
        faiss.write_index(self.index, str(self.index_path))

    def _get_embedding(self, text: str) -> np.ndarray:
        """Generate embedding for a text using the model."""
        inputs = self.tokenizer(text, return_tensors="pt", 
                              truncation=True, max_length=512,
                              padding=True).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1).cpu().numpy()
        
        return embeddings

    def _chunk_text(self, text: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
        """Split text into overlapping chunks."""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
        
        return chunks

    async def ingest(self, content: bytes, filename: str) -> str:
        """
        Process and add a document to the RAG system.
        
        Args:
            content: Document content in bytes
            filename: Name of the document file
            
        Returns:
            str: Document ID
        """
        try:
            # Convert bytes to text
            text = content.decode('utf-8')
            
            # Generate a document ID
            doc_id = f"doc_{len(self.documents)}"
            
            # Chunk the document
            chunks = self._chunk_text(text)
            
            # Process each chunk
            for i, chunk in enumerate(chunks):
                # Generate embedding
                embedding = self._get_embedding(chunk)
                
                # Add to FAISS index
                self.index.add(embedding)
                
                # Store chunk metadata
                self.documents.append({
                    "doc_id": doc_id,
                    "chunk_id": i,
                    "filename": filename,
                    "content": chunk,
                    "created_at": int(time.time())
                })
            
            # Save updated data
            self._save_data()
            
            return doc_id
            
        except Exception as e:
            raise Exception(f"Error processing document: {str(e)}")

    async def query(self, question: str, lang: str = "en", k: int = 3) -> str:
        """
        Get response for a query using RAG.
        
        Args:
            question: The query text
            lang: Language of the query (en/hi)
            k: Number of chunks to retrieve
            
        Returns:
            str: Response text
        """
        try:
            # Generate query embedding
            query_embedding = self._get_embedding(question)
            
            # Convert to float32 and normalize
            query_embedding = query_embedding.astype(np.float32)
            faiss.normalize_L2(query_embedding)
            
            # Search similar chunks
            D, I = self.index.search(query_embedding, k)
            
            # Get relevant chunks
            relevant_chunks = [self.documents[i]["content"] for i in I[0]]
            
            # Combine chunks into context
            context = "\n".join(relevant_chunks)
            
            # For now, return the most relevant chunk
            # TODO: Integrate with a language model for better response generation
            return relevant_chunks[0]
            
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")

    def clear(self):
        """Clear all stored documents and reset the index."""
        self.documents = []
        self.index = faiss.IndexFlatL2(self.embedding_dim)
        self._save_data()