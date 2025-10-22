// Header.jsx (or similar)
"use client"
import styles from "./Header.module.css"; // 👈 Import the CSS module

export default function Header() {
    return (
        // Replaced Tailwind classes with styles.header
        <header className={styles.header}>
            <input
                type="text"
                placeholder="Search for students/teachers/documents..."
                // Replaced Tailwind classes with styles.searchInput
                className={styles.searchInput}
            />
            <div className={styles.adminInfoContainer}>
                {/* Replaced Tailwind classes with styles.adminText */}
                <span className={styles.adminText}>👤 Admin</span>
            </div>
        </header>
    );
}