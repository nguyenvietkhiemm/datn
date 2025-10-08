"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./Flashcards.module.css";
import Cookies from "js-cookie";

type Flashcard = {
  flashcard_id: number;
  front: string;
  back: string;
  example: string;
  created_at: string;
  status: string | null;
  flashcard_deck_id: number;
};

export default function FlashcardDetail() {
  const { deck_id } = useParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách flashcard của deck
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/flashcards/decks/${deck_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Không thể lấy danh sách flashcard");
        const json = await res.json();
        const data = Array.isArray(json) ? json : json.data;
        setFlashcards(data || []);
      } catch (error) {
        console.error("Lỗi khi fetch flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [deck_id]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh sách Flashcard</h1>

      {flashcards.length === 0 ? (
        <p>Chưa có thẻ flashcard nào trong bộ này.</p>
      ) : (
        <div className={styles.grid}>
          {flashcards.map((card) => (
            <div key={card.flashcard_id} className={styles.card}>
              <h3 className={styles.front}>{card.front}</h3>
              <p className={styles.back}><strong>Đáp án:</strong> {card.back}</p>
              {card.example && (
                <p className={styles.example}><strong>Ví dụ:</strong> {card.example}</p>
              )}
              <p className={styles.date}>
                Ngày tạo: {new Date(card.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
