import os
from docx import Document

def read_docx(file_path):
    doc = Document(file_path)
    chunks = []

    for p in doc.paragraphs:
        text = p.text.strip()
        if text:
            chunks.append(text)

    return chunks
