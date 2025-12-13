import os
import json
import pandas as pd
from sentence_transformers import SentenceTransformer

from ocr_pdf import read_pdf_smart
from input_docx import read_docx


def load_documents(folder_path="test_data"):
    docs = []
    chunk_id = 0

    for fname in os.listdir(folder_path):
        fpath = os.path.join(folder_path, fname)

        # Only accept PDF & DOCX
        if fname.lower().endswith(".pdf"):
            print(f"\nĐọc PDF: {fname}")
            text_chunks = read_pdf_smart(fpath)

        elif fname.lower().endswith(".docx"):
            print(f"\nĐọc DOCX: {fname}")
            text_chunks = read_docx(fpath)

        else:
            continue

        # Save chunks
        for text in text_chunks:
            docs.append({
                "chunk_id": chunk_id,
                "text": text,
                "file_name": fname,
                "file_path": fpath
            })
            chunk_id += 1

    print("\n")
    print("Tổng số chunk:", len(docs))
    print("\n")

    return docs



def create_embeddings(docs, model_name="BAAI/bge-small-en-v1.5"):
    print(f"🔢 Loading model: {model_name}")
    model = SentenceTransformer(model_name)

    rows = []
    for d in docs:
        vec = model.encode(d["text"]).tolist()

        rows.append({
            "chunk_id": d["chunk_id"],
            "text": d["text"],
            "embedding": json.dumps(vec),
            "file_name": d["file_name"],
            "file_path": d["file_path"]
        })

    return rows

def save_to_csv(rows, output_file="vector_store.csv"):
    df = pd.DataFrame(rows)
    df.to_csv(output_file, index=False)

    print("\n=======================")
    print(f"🎉 DONE → Saved: {output_file}")
    print(f"📌 Tổng số dòng: {len(df)}")
    print("=======================")


def main():
    folder_path = "test_data"

    # 1) Load files
    docs = load_documents(folder_path)

    # 2) Embedding
    rows = create_embeddings(docs)

    # 3) Save CSV
    save_to_csv(rows)

if __name__ == "__main__":
    main()
