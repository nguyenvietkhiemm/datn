import requests

HF_SPACE_URL = "https://hungluong10-chatbot-rag.hf.space/api/rag"

def ask_llm(question: str, context: str) -> str:
    payload = {
        "question": question,
        "context": context
    }

    response = requests.post(
        HF_SPACE_URL,
        json=payload,
        timeout=60
    )

    response.raise_for_status()
    return response.json()["answer"]
