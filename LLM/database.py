# db_writer.py
import psycopg2
from pgvector.psycopg2 import register_vector


def get_conn():
    conn = psycopg2.connect(
        host="localhost",
        database="postgres",
        user="postgres",
        password="12345"
    )
    register_vector(conn)
    return conn


def insert_document(cur, title, link):
    cur.execute("""
        INSERT INTO document (title, link)
        VALUES (%s, %s)
        RETURNING document_id
    """, (title, link))
    return cur.fetchone()[0]


def insert_chunk(cur, document_id, title, text, link, embedding):
    cur.execute("""
        INSERT INTO chunk (document_id, title, text, link, embedding)
        VALUES (%s, %s, %s, %s, %s)
    """, (document_id, title, text, link, embedding))


def save_to_db(docs):
    conn = get_conn()
    cur = conn.cursor()

    for doc in docs:
        # 1️⃣ document
        document_id = insert_document(
            cur,
            doc["file_name"],
            doc["file_path"]
        )

        # 2️⃣ chunks
        for text, vec in zip(doc["chunks"], doc["embeddings"]):
            insert_chunk(
                cur,
                document_id,
                doc["file_name"],
                text,
                doc["file_path"],
                vec
            )

    conn.commit()
    cur.close()
    conn.close()

def search_chunks(query_vector, top_k=5):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            title,
            text,
            link,
            embedding <=> %s::vector AS score
        FROM chunk
        ORDER BY embedding <=> %s::vector
        LIMIT %s
    """, (query_vector, query_vector, top_k))

    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows


