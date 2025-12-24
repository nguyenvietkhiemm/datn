# vectorizer.py
import os
from typing import List, Dict
from sentence_transformers import SentenceTransformer
from ocr_pdf import read_pdf_smart
from input_docx import read_docx

# =====================
# CONFIG
# =====================
MODEL_NAME = os.getenv("EMBEDDING_MODEL", "BAAI/bge-small-en-v1.5")
BATCH_SIZE = int(os.getenv("EMBED_BATCH_SIZE", 32))
DEVICE = os.getenv("EMBED_DEVICE", "cpu")  # "cuda" nếu có GPU

# =====================
# MODEL SINGLETON
# =====================
_model: SentenceTransformer | None = None


def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        print(f"🔢 Loading embedding model: {MODEL_NAME} ({DEVICE})")
        _model = SentenceTransformer(
            MODEL_NAME,
            device=DEVICE
        )
    return _model


# =====================
# DOCUMENT LOADER
# =====================
def load_documents(folder_path: str = "test_data") -> List[Dict]:
    docs = []

    for fname in os.listdir(folder_path):
        fpath = os.path.join(folder_path, fname)

        if fname.lower().endswith(".pdf"):
            print(f"📄 Đọc PDF: {fname}")
            chunks = read_pdf_smart(fpath)

        elif fname.lower().endswith(".docx"):
            print(f"📄 Đọc DOCX: {fname}")
            chunks = read_docx(fpath)

        else:
            continue

        # clean empty chunks
        chunks = [c.strip() for c in chunks if c and c.strip()]

        docs.append({
            "file_name": fname,
            "file_path": fpath,
            "chunks": chunks,
        })

    return docs


# =====================
# EMBEDDING
# =====================
def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Encode nhiều text một lúc (batch)
    """
    model = get_model()
    embeddings = model.encode(
        texts,
        batch_size=BATCH_SIZE,
        show_progress_bar=True,
        normalize_embeddings=True  # rất quan trọng cho semantic search
    )
    return embeddings.tolist()


def embed_text(text: str) -> List[float]:
    """
    Encode 1 text (query)
    """
    return embed_texts([text])[0]


def create_embeddings(docs: List[Dict]) -> List[Dict]:
    """
    Embed toàn bộ document chunks
    """
    for doc in docs:
        print(f"🔎 Embedding: {doc['file_name']} ({len(doc['chunks'])} chunks)")
        doc["embeddings"] = embed_texts(doc["chunks"])
    return docs
