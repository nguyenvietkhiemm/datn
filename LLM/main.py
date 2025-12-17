from vectorizer import load_documents, create_embeddings
from database import save_to_db


def main():
    # load data từ thư mục "test_data"
    docs = load_documents("test_data")
    # tạo embeddings
    docs = create_embeddings(docs)
    # lưu vào db
    save_to_db(docs)

    print("Vector hóa + lưu DB hoàn tất")


if __name__ == "__main__":
    main()
