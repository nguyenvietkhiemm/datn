// Header.jsx (or similar)
"use client"
import styles from "./Header.module.css"; // 👈 Import the CSS module
import { useRouter } from "next/navigation";

export default function Header() {

    const router = useRouter();
    const hanldeLogout = () => {
        localStorage.clear();
        router.push(`/admin/login`)
    }
    return (
        // Replaced Tailwind classes with styles.header
        <header className={styles.header}>
            <div className={styles.adminInfoContainer}>
                {/* Replaced Tailwind classes with styles.adminText */}
                <span className={styles.adminText}>Đăng xuất</span>
            </div>
        </header>
    );
}