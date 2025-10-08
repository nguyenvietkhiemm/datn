"use client";
import { useEffect, useState } from "react";
import styles from "./FlashcardDeck.module.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const option_flash = [
    { name: "List từ của tôi" },
    { name: "Đang học" },
    { name: "Khám phá" },
];

type FlashcardDeck = {
    flashcard_deck_id: number;
    title: string;
    description: string;
    created_at: Date;
};

export default function Flashcards() {
    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [page, setPage] = useState(1);
    const router = useRouter();

    const flashcardsDetail = (deck_id: number) => {
        router.push(`/flashcards/${deck_id}`);
    };

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const token = Cookies.get("token");
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/flashcards/decks?page=${page}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error("Không thể lấy danh sách deck");
                const json = await res.json();
                const decksData = Array.isArray(json) ? json : json.data;
                setDecks(decksData || []);
            } catch (error) {
                console.error("Lỗi khi fetch decks:", error);
            }
        };

        fetchDecks();
    }, [page]);

    const filteredDecks = decks;

    return (
        <div className={styles.container}>
            {/* Tabs */}
            <div className={styles.options}>
                <h1 className={styles.title}>Flashcards</h1>
                {option_flash.map((option, index) => (
                    <button
                        key={index}
                        className={`${styles.optionButton} ${currentIndex === index ? styles.active : ""}`}
                        onClick={() => setCurrentIndex(index)}
                    >
                        {option.name}
                    </button>
                ))}
            </div>

            {/* Danh sách deck */}
            <h2 className={styles.deckTitle}>List từ đã tạo</h2>

            <div className={styles.deckList}>
                <div className={styles.createDeck}>
                    <a href="#">
                        <span>Tạo list từ</span>
                    </a>
                </div>

                {filteredDecks.length > 0 ? (
                    filteredDecks.map((deck) => (
                        <div
                            key={deck.flashcard_deck_id}
                            className={styles.deckCard}
                            onClick={() => flashcardsDetail(deck.flashcard_deck_id)}
                        >
                            <h3>{deck.title}</h3>
                            <p>{deck.description}</p>
                            <p>
                                Ngày tạo:{" "}
                                {new Date(deck.created_at).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Chưa có deck nào trong mục này.</p>
                )}
            </div>

            {/* Điều khiển phân trang */}
            <div className={styles.pagination}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Trang trước
                </button>
                <span>Trang {page}</span>
                <button onClick={() => setPage(page + 1)}>Trang sau</button>
            </div>
        </div>
    );
}
