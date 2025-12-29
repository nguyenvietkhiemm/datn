// Header.jsx (or similar)
"use client"
import styles from "./Header.module.css"; 
import { useRouter } from "next/navigation";
import { Button } from "../ui/button/Button";
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
                <Button onClick={hanldeLogout}>Đăng xuất</Button>
            </div>
        </header>
    );
}