"use client";
import { useState } from "react";
import styles from "./Flashcards.module.css";

const decks = [
    { id: 1, title: "Từ vựng Tiếng Anh giao tiếp cơ bản", learned: 48, remembered: 48, review: 0, code: "0931trl", category: 0 },
    { id: 2, title: "Toán lớp 10", learned: 20, remembered: 15, review: 5, code: "math10", category: 1 },
    { id: 3, title: "Khoa học tự nhiên", learned: 10, remembered: 5, review: 5, code: "science", category: 2 },
];

const option_flash = [
    { name: 'List từ của tôi' },
    { name: 'Đang học' },
    { name: 'Khám phá' }
];

export default function Flashcards() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const filteredDecks = decks.filter(deck => deck.category === currentIndex);

    return (
        <div className={styles.container}>
            <div className={styles.options}>
                <h1 className={styles.title}>Flashcards</h1>
                {option_flash.map((option, index) => (
                    <button
                        key={index}
                        className={`${styles.optionButton} ${currentIndex === index ? styles.active : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    >
                        {option.name}
                    </button>
                ))}
            </div>

            <h2 className={styles.deckTitle}>List từ đã tạo</h2>

            <div className={styles.deckList}>
                <div className={styles.createDeck}>
                    <a href="">
                        <span>Tạo list từ</span>
                    </a>
                </div>

                {filteredDecks.length > 0 ? (
                    filteredDecks.map(deck => (
                        <div key={deck.id} className={styles.deckCard}>
                            <h3>{deck.title}</h3>
                            <p>Đã học: {deck.learned}</p>
                            <p>Nhớ được: {deck.remembered}</p>
                            <p>Cần ôn tập: {deck.review}</p>
                            <p>Mã Deck: {deck.code}</p>
                        </div>
                    ))
                ) : (
                    <p>Chưa có deck nào trong mục này.</p>
                )}
            </div>
        </div>
    );
}
