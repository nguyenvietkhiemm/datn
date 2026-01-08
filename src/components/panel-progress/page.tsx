"use client";
import { useState } from "react";
import CurrentProgress from "@/components/current-progress/page";
import styles from "./PanelProgress.module.css";
import { BarChart2, X } from "lucide-react";

export default function ProgressPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide Panel */}
      <div
        className={`${styles.slidePanel} ${isOpen ? styles.open : ""}`}
      >
        <button
          className={styles.closeBtn}
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>

        <CurrentProgress isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Floating Toggle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={styles.floatingBtn}
        >
          <BarChart2 size={18} />
          <span>Tiến độ</span>
        </button>
      )}
    </>
  );
}
