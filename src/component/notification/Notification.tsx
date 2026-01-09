"use client";

import { useEffect } from "react";
import styles from "./NotificationPopup.module.css";
import React from "react";
import NotificationIcon from "./icon/NotificationIcon";
import { Button } from "../ui/button/Button";

export type NotificationType = "success" | "error" | "warning" | "info" | "loading";

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
    duration = 10000000,
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
        <div className={`${confirm ? styles.overlay : styles.noti}`}>
            <div className={`${styles.popup} ${styles[type]}`}>
                <div className={styles.infoNoti}>
                    <div className={styles.icon}>
                        <div className={styles.icon}>
                            <NotificationIcon type={type} />
                        </div>
                    </div>
                    <div className={styles.message}>{message}</div>
                </div>

                {confirm && (
                    <div className={styles.actions}>
                        <Button
                            onClick={() => {
                                onCancel?.();
                                onClose();
                            }}
                        >
                            Không
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm?.();
                                onClose();
                            }}
                        >
                            Có
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
