"use client";
import { useState, useRef, useEffect } from "react";
import CurrentProgress from "@/components/current-progress/page";

export default function ProgressPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>

            {isOpen ? (
                <CurrentProgress />
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-40 right-5 p-2 bg-white-500 text-black rounded border border-gray-300 cursor-pointer"
                >
                    Tiến độ
                </button>
            )}
        </>
    );
}
