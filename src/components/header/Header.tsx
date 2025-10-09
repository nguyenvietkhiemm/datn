"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/userSlices";
import Setting from "../setting/Setting";
import styles from "./Header.module.css";

export default function Header() {
  const [showSetting, setShowSetting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const userRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsClient(true);
    setUserName(localStorage.getItem("user_name"));
    setToken(Cookies.get("token") || null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_name");
    Cookies.remove("token");
    setIsClient(false)
    dispatch(logout());
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowSetting(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const listNavbar = [
    { name: "Giới thiệu", href: "/introduction" },
    { name: "Luyện tập", href: "/exam" },
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
            {listNavbar.map((item, idx) => (
              <Link key={idx} href={item.href} className={styles.navItem}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.right}>
          {isClient && token ? (
            <div className={styles.user} ref={userRef}>
              <div
                className={styles.avatar}
                onClick={() => setShowSetting(!showSetting)}
              >
                {userName?.[0] || "A"}
              </div>
              <span onClick={() => setShowSetting(!showSetting)}>
                {userName || "Tài khoản"}
              </span>
              {showSetting && <Setting onLogout={handleLogout} />}
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
