"use client";

import { useEffect, useRef } from "react";
import styles from "./AutoResizeTextarea.module.css";

interface AutoResizeTextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    autoFocus?: boolean;
    setEditCell?: (cell: { row: number; col: number } | null) => void;
    onBlur?: () => void; 
}

export default function AutoResizeTextarea({
    value,
    onChange,
    autoFocus = false,
    setEditCell,
    onBlur, 
}: AutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Auto Resize Height
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={value}
            onChange={onChange}
            autoFocus={autoFocus}
            onBlur={() => {
                onBlur?.(); // 🟢 GỌI HÀM onBlur (nếu có)
                setEditCell?.(null); // vẫn đóng editor như cũ
            }}
        />
    );
}
