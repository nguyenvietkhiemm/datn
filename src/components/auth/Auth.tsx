"use client";

import { JSX, useState } from "react";
import styles from "./Auth.module.css";
import Link from "next/link";

interface AuthProps {
  isLogin: boolean;
}

interface SendData {
  username?: string;
  email: string;
  password: string;
}

export default function Auth({ isLogin }: AuthProps): JSX.Element {
  const [formData, setFormData] = useState<SendData>({
    username: "",
    email: "",
    password: "",
  });

  const handleState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(" Gửi dữ liệu:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
        <span>
          {isLogin
            ? "Chào mừng bạn! Vui lòng đăng nhập"
            : "Tạo tài khoản để bắt đầu học"}
        </span>
      </div>

      <div className={styles.fields}>
        {!isLogin && (
          <div className={styles.field}>
            <label>Tên đăng nhập</label>
            <input
              name="username"
              placeholder="Tên đăng nhập"
              type="text"
              value={formData.username}
              onChange={handleState}
            />
          </div>
        )}

        <div className={styles.field}>
          <label>Email</label>
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleState}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Mật khẩu</label>
          <input
            name="password"
            placeholder="Mật khẩu"
            type="password"
            value={formData.password}
            onChange={handleState}
            required
          />
        </div>
      </div>

      <button type="submit" className={styles.submitBtn}>
        {isLogin ? "Đăng nhập" : "Đăng ký"}
      </button>

      <div className={styles.switch}>
        {isLogin ? (
          <>
            Bạn chưa có tài khoản?{" "}
            <Link className={styles.switchLink} href="/register">
              Đăng ký
            </Link>
          </>
        ) : (
          <>
            Bạn đã có tài khoản?{" "}
            <Link className={styles.switchLink} href="/login">
              Đăng nhập
            </Link>
          </>
        )}
      </div>
    </form>
  );
}
