"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css"; 

export default function Header() {
  const [isToken, setIsToken] = useState(false);

  const listNavbar = [
    { name: "Giới thiệu", href: "/" },
    { name: "Luyện tập", href: "/practice" },
    { name: "Flashcards", href: "/flashcards" },
    { name: "Road map", href: "/roadmap" },
    { name: "Tài liệu", href: "/documents" },
    { name: "Thi thử", href: "/exam" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            Avatar trang web
          </Link>

          <nav className={styles.nav}>
            {listNavbar.map((item, i) => (
              <Link key={i} href={item.href} className={styles.navItem}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.right}>
          {isToken ? (
            <div className={styles.user}>
              <div className={styles.avatar}>A</div>
              <span>Tài khoản</span>
            </div>
          ) : (
            <div className={styles.auth}>
              <Link href="/login" className={styles.login}>
                Đăng nhập
              </Link>
              <Link href="/register" className={styles.register}>
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
