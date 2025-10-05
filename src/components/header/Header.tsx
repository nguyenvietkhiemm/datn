"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLogin(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token"); 
    localStorage.removeItem("user")
    setIsLogin(false);      
    router.push("/login");   
  };

  const listNavbar = [
    { name: "Giới thiệu", href: "/introduction" },
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
        </div>

        <div className={styles.center}>
          <nav className={styles.nav}>
            {listNavbar.map((item, i) => (
              <Link key={i} href={item.href} className={styles.navItem}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.right}>
          {isLogin ? (
            <div className={styles.user}>
              <div className={styles.avatar}>A</div>
              <span>Tài khoản</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Đăng xuất
              </button>
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
