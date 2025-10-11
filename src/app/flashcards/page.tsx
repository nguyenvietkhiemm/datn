"use client";
import { useEffect, useState } from "react";
import styles from "./FlashcardDeck.module.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Pagination from "@/components/pagination/Pagination";
import { AddFlashcardDeck } from "@/components/add-flashcard-deck/AddFlashcardDeck";

const option_flash = [
    { name: "List từ của tôi" },
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
    const router = useRouter();
    const [showAddDeckForm, setShowAddDeckForm] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const flashcardsDetail = (deck_id: number, title: string) => {
        router.push(`/flashcards/${deck_id}?flashcard_deck_title=${title}`);
    };

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const token = Cookies.get("token");
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/flashcards/decks?page=${currentPage}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error("Không thể lấy danh sách deck");
                const json = await res.json();

                setDecks(json.data.data);
                setTotalPages(json.data.totalPages);
            } catch (error) {
                console.error("Lỗi khi fetch decks:", error);
            }
        };

        fetchDecks();
    }, [currentPage]);

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
                <div className={styles.createDeck} onClick={() => setShowAddDeckForm(true)}>
                    <span>Tạo list từ</span>
                </div>

                {filteredDecks.length > 0 ? (
                    filteredDecks.map((deck) => (
                        <div
                            key={deck.flashcard_deck_id}
                            className={styles.deckCard}
                            onClick={() => flashcardsDetail(deck.flashcard_deck_id, deck.title)}
                        >
                            <h3>{deck.title}</h3>
                            <p>{deck.description}</p>
                            <p>
                                Ngày tạo:{" "}
                                {new Date(deck.created_at).toLocaleString("vi-VN", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Chưa có deck nào trong mục này.</p>
                )}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {/* form tao kist tu */}
            {showAddDeckForm && (
                <div className={styles.modalOverlay} onClick={() => setShowAddDeckForm(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <AddFlashcardDeck setShowAddDeckForm={setShowAddDeckForm} />
                        <button className={styles.closeButton} onClick={() => setShowAddDeckForm(false)}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
