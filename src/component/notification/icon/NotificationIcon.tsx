import React from "react";
import { NotificationType } from "../Notification";

interface Props {
    type: NotificationType;
}

export default function NotificationIcon({ type }: Props) {
    switch (type) {
        case "success":
            return (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path
                        d="M7 12l3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );

        case "error":
            return (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path
                        d="M9 9l6 6M15 9l-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            );

        case "warning":
            return (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
                    <path
                        d="M12 3l9 16H3l9-16z"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path d="M12 9v4" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
            );

        case "loading":
            return (
                <svg
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="none"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeOpacity="0.25"
                    />
                    <path
                        d="M22 12a10 10 0 0 1-10 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 12 12"
                            to="360 12 12"
                            dur="1s"
                            repeatCount="indefinite"
                        />
                    </path>
                </svg>
            );

        case "info":
        default:
            return (
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 10v6" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="7" r="1" fill="currentColor" />
                </svg>
            );
    }
}
