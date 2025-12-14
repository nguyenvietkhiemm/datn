# vectorizer.py
import os
from sentence_transformers import SentenceTransformer
from ocr_pdf import read_pdf_smart
from input_docx import read_docx


def load_documents(folder_path="test_data"):
    docs = []

    for fname in os.listdir(folder_path):
        fpath = os.path.join(folder_path, fname)

        if fname.lower().endswith(".pdf"):
            print(f"\nĐọc PDF: {fname}")
            chunks = read_pdf_smart(fpath)

        elif fname.lower().endswith(".docx"):
            print(f"\nĐọc DOCX: {fname}")
            chunks = read_docx(fpath)

        else:
            continue

        docs.append({
            "file_name": fname,
            "file_path": fpath,
            "chunks": chunks
        })

    return docs


def create_embeddings(docs, model_name="BAAI/bge-small-en-v1.5"):
    print(f"🔢 Loading model: {model_name}")
    model = SentenceTransformer(model_name)

    for doc in docs:
        doc["embeddings"] = [
            model.encode(text).tolist()
            for text in doc["chunks"]
        ]

    return docs
