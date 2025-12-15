from vectorizer import load_documents, create_embeddings
from database import save_to_db


def main():
    docs = load_documents("test_data")
    docs = create_embeddings(docs)
    save_to_db(docs)

    print("Vector hóa + lưu DB hoàn tất")


if __name__ == "__main__":
    main()
