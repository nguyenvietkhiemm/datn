from vectorizer import embed_text
from database import search_chunks
from request_llm import ask_llm

def run_pipeline(question: str):
    query_vec = embed_text(question)
    chunks = search_chunks(query_vec, top_k=5)

    context = "\n\n".join(
        [f"[SOURCE: {c[2]}]\n{c[1]}" for c in chunks]
    )

    answer = ask_llm(question, context)

    sources = [
        {
            "file_name": c[0],
            "file_path": c[2],
            "score": float(c[3]),
            "preview": c[1][:200]
        }
        for c in chunks
    ]

    return {
        "question": question,
        "answer": answer,
        "sources": sources
    }




if __name__ == "__main__":
    # 👇 nhập thẳng ở đây
    question = "Trong điều kiện chuẩn về nhiệt độ và áp suất thì"
    result = run_pipeline(question)
    print(result["answer"])
