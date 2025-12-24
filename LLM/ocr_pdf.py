import os
import fitz
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
import random
import multiprocessing as mp


def ocr_image(img):
    """OCR một ảnh duy nhất."""
    return pytesseract.image_to_string(img, lang="vie").strip()


def read_pdf_smart(file_path):
    """
    Trả về list text chunk từ PDF.
    Nếu PDF có text → PyMuPDF
    Nếu scan → OCR multiprocess
    """
    pdf = fitz.open(file_path)
    total_pages = len(pdf)

    sample_pages = random.sample(range(total_pages), k=min(5, total_pages))
    text_pages = sum(
        1 for p in sample_pages
        if pdf.load_page(p).get_text("text").strip()
    )

    if text_pages >= 3:
        print(f"TEXT PDF → {os.path.basename(file_path)}")
        texts = []
        for page in pdf:
            t = page.get_text("text").strip()
            if t:
                texts.append(t)

        pdf.close()
        return texts


    print(f"OCR PDF → {os.path.basename(file_path)}")

    try:
        images = convert_from_path(file_path, dpi=200, thread_count=4)
    except Exception:
        print("Poppler lỗi → dùng PyMuPDF export ảnh")
        images = []
        for i in range(total_pages):
            pix = pdf.load_page(i).get_pixmap(dpi=200)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            images.append(img)

    pdf.close()

    cpu_use = max(1, mp.cpu_count() - 3)
    print(f"CPU sử dụng: {cpu_use}")

    with mp.Pool(cpu_use) as pool:
        results = pool.map(ocr_image, images)

    return [r for r in results if r]  # lọc empty
