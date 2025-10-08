"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Setting from "../setting/Setting";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/userSlices";
import { RootState } from "@/store";

export default function Header() {
  const [showSetting, setShowSetting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const userRef = useRef<HTMLDivElement>(null);

  // Lấy state user
  const userName = localStorage.getItem("user_name")
  const cookie = Cookies.get("token")
  
  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user_name")
    dispatch(logout());
    window.location.href = "/login";
  };

  // Click ngoài để đóng menu Setting
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
        {/* Logo */}
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            Avatar trang web
          </Link>
        </div>

        {/* Navbar */}
        <div className={styles.center}>
          <nav className={styles.nav}>
            {listNavbar.map((item, index) => (
              <Link key={index} href={item.href} className={styles.navItem}>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* User / Auth */}
        <div className={styles.right}>
          {cookie ? (
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
