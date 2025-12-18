"use client";
import { useState } from "react";
import styles from "./ChatMini.module.css";

type Message = {
    id: number;
    text: string;
    sender: "user" | "bot";
};

export default function MiniChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Xin chào Tôi có thể hỗ trợ gì cho bạn?",
            sender: "bot",
        },
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: input,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // fake bot reply
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Cảm ơn bạn đã nhắn, bên mình sẽ phản hồi sớm ",
                    sender: "bot",
                },
            ]);
        }, 800);
    };

    return (
        <>
            {!open && (
                <button
                    className={styles.chatButton}
                    onClick={() => setOpen(true)}
                >
                    💬
                </button>
            )}

            {open && (
                <div className={styles.chatBox}>
                    {/* HEADER */}
                    <div className={styles.header}>
                        <span>Hỗ trợ khách hàng</span>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setOpen(false)}
                        >
                            ✖
                        </button>
                    </div>

                    {/* MESSAGES */}
                    <div className={styles.messages}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.message} ${msg.sender === "user"
                                        ? styles.user
                                        : styles.bot
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* INPUT */}
                    <div className={styles.inputBox}>
                        <input
                            className={styles.input}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Nhập tin nhắn..."
                        />
                        <button
                            className={styles.sendBtn}
                            onClick={sendMessage}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
