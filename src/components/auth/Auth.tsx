"use client";

import { JSX, useState } from "react";
import styles from "./Auth.module.css";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userSlices";

interface AuthProps {
  isLogin: boolean;
}

interface SendData {
  user_name?: string;
  email: string;
  password: string;

}

export default function Auth({ isLogin }: AuthProps): JSX.Element {
  const [formData, setFormData] = useState<SendData>({
    user_name: "",
    email: "",
    password: "",
  });

  const handleState = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();
  const dispatch = useDispatch();

  //ham dang ky, dang nhap
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const API = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const route = isLogin ? "/auth/login" : "/auth/register";
    console.log(`${API}${route}`);
    const res = await fetch(`${API}${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Đã có lỗi xảy ra");
    }

    const data = await res.json();
    //cookie & redux
    if (data.data.token) {
      Cookies.set("token", data.data.token, { expires: 3 });
      if (data.data.user) {
        const user = data.data.user;
        dispatch(login(
          {
            user_name: user.user_name,
            email: user.email,
            available: user.available,
            birthday: user.birthday,
            created_at: user.created_at
          }
        ))
      }
      router.push(`/`)
    }
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
              name="user_name"
              placeholder="Tên đăng nhập"
              type="text"
              value={formData.user_name}
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
