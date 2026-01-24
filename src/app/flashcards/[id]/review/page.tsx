"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shuffle, ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./FlashcardReview.module.css";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";


interface Flashcard {
    flashcard_id: number;
    front: string;
    back: string;
}

const FlashcardApp = () => {
    const { id } = useParams();
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [deck, setDeck] = useState<Flashcard[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get("token");
            const URL_API = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

            const res = await fetch(`${URL_API}/flashcards/quiz/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const json = await res.json();
            const list: Flashcard[] = json.data || [];

            setDeck(list);
        };

        fetchData();
    }, [id]);

    const nextCard = () => {
        setFlipped(false);
        setIndex((prev) => (prev + 1) % deck.length);
    };

    const prevCard = () => {
        setFlipped(false);
        setIndex((prev) => (prev - 1 + deck.length) % deck.length);
    };

    const shuffleDeck = () => {
        const newDeck = [...deck].sort(() => Math.random() - 0.5);
        setDeck(newDeck);
        setIndex(0);
        setFlipped(false);
    };

    return (
        <div className={styles.container}>
            <motion.div className={styles.card} onClick={() => setFlipped(!flipped)}>
                <motion.div
                    className={`${styles.cardInner} ${flipped ? styles.flipped : ""}`}
                    transition={{ duration: 0.6 }}
                >
                    <div className={`${styles.cardContent} ${styles.front}`}>
                        {deck[index]?.front}
                    </div>
                    <div className={`${styles.cardContent} ${styles.back}`}>
                        {deck[index]?.back}
                    </div>
                </motion.div>
            </motion.div>

            <div className={styles.controls}>
                <button onClick={prevCard} className={styles.button}>
                    <ArrowLeft />
                </button>
                <button onClick={shuffleDeck} className={styles.button}>
                    <Shuffle />
                </button>
                <button onClick={nextCard} className={styles.button}>
                    <ArrowRight />
                </button>
            </div>

            <p className={styles.counter}>
                Thẻ {index + 1} / {deck.length}
            </p>
        </div>
    );
};

export default FlashcardApp;
