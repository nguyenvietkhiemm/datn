"use client"
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiBell, FiSettings, FiLogOut, FiUser } from "react-icons/fi"; // icon thư viện react-icons
import { useState, useRef, useEffect } from "react";

export default function Header() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/admin/login");
    };

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className={styles.header}>

            {/* Search */}
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Tìm kiếm..."
                />
            </div>

            {/* Right: Notification + Avatar */}
            <div className={styles.rightContainer}>
                {/* Notification */}
                <button className={styles.iconButton}>
                    <FiBell size={20} />
                </button>

                {/* Profile / dropdown */}
                <div className={styles.avatarContainer} ref={dropdownRef}>
                    <button
                        className={styles.avatarButton}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {/* Thay thế Image bằng div chữ cái */}
                        <div
                            className={styles.avatarDefault}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            NK
                        </div>

                    </button>
                    {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <button className={styles.dropdownItem}>
                                <FiUser /> Profile
                            </button>
                            <button className={styles.dropdownItem}>
                                <FiSettings /> Settings
                            </button>
                            <button className={styles.dropdownItem} onClick={handleLogout}>
                                <FiLogOut /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
