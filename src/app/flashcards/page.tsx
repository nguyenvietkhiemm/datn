"use client";
import { useEffect, useState } from "react";
import styles from "./FlashcardDeck.module.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Pagination from "@/components/pagination/Pagination";
import { AddFlashcardDeck } from "@/components/add-flashcard-deck/AddFlashcardDeck";
import { formatVNDateTime } from "../../../lib/model";

type FlashcardDeck = {
    flashcard_deck_id: number;
    title: string;
    description: string;
    created_at: Date;
};

export default function Flashcards() {
    const [decks, setDecks] = useState<FlashcardDeck[]>([]);
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
            {/* Danh sách deck */}
            <h2 className={styles.deckTitle}>Danh sách bộ thẻ ghi nhớ đã tạo</h2>

            <div className={styles.deckList}>
                <div className={styles.createDeck} onClick={() => setShowAddDeckForm(true)}>
                    <span>Tạo danh sách từ</span>
                </div>

                {filteredDecks.length > 0 ? (
                    filteredDecks.map((deck) => (
                        <div
                            key={deck.flashcard_deck_id}
                            className={styles.deckCard}
                            onClick={() => flashcardsDetail(deck.flashcard_deck_id, deck.title)}
                        >
                            <h3>{deck.title}</h3>
                            <p className={styles.description}>{deck.description}</p>
                            <p className={styles.date}>
                            Ngày tạo:{" "}
                                {formatVNDateTime(deck.created_at)}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Chưa có danh sách nào trong mục này.</p>
                )}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {/* form tao kist tu */}
            {showAddDeckForm && (
                <div className={styles.modalOverlay} onClick={() => setShowAddDeckForm(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <AddFlashcardDeck setShowAddDeckForm={setShowAddDeckForm} />
                        <button className={styles.closeButton} onClick={() => setShowAddDeckForm(false)}>
                            x
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
