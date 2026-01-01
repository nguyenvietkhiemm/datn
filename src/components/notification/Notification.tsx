"use client";

import { useEffect } from "react";
import styles from "./NotificationPopup.module.css";
import React from "react";
import NotificationIcon from "./icon/NotificationIcon";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationPopupProps {
    message: React.ReactNode;
    type?: NotificationType;
    duration?: number;
    confirm?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose: () => void;
}

export default function NotificationPopup({
    message,
    type = "info",
    duration = 3000,
    confirm = false,
    onConfirm,
    onCancel,
    onClose,
}: NotificationPopupProps) {
    useEffect(() => {
        if (confirm) return;

        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [confirm, duration, onClose]);

    return (
        <div className={styles.overlay}>
            <div className={`${styles.popup} ${styles[type]}`}>
                <div className={styles.icon}>
                    <div className={styles.icon}>
                        <NotificationIcon type={type} />
                    </div>

                </div>

                <div className={styles.message}>{message}</div>

                {confirm && (
                    <div className={styles.actions}>
                        <button
                            className={styles.cancel}
                            onClick={() => {
                                onCancel?.();
                                onClose();
                            }}
                        >
                            Không
                        </button>
                        <button
                            className={styles.confirm}
                            onClick={() => {
                                onConfirm?.();
                                onClose();
                            }}
                        >
                            Có
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
