"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
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

  //lay state
  const isLogin = useSelector((state : RootState) => state.user.isLoggedIn);
  
  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(logout())
    router.push("/login");
  };

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
              <div className={styles.avatar} onClick={() => setShowSetting(!showSetting)}>A</div>
              <span onClick={() => setShowSetting(!showSetting)}>Tài khoản</span>

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
