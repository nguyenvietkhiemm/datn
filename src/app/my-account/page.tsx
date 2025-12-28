"use client";
import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import styles from "./MyAccount.module.css";
import Cookies from "js-cookie";
import ProfilePage from "@/components/profile/page";

interface User {
  user_name: string;
  email: string;
  birthday?: string;
  created_at?: string;
}

export default function ProfileInfo() {
  const [user, setUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
  });

  const [editing, setEditing] = useState({
    name: false,
    email: false,
    dob: false,
  });

  /* ===== LOAD USER ===== */
  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (!userRaw) return;

    const parsed: User = JSON.parse(userRaw);
    setUser(parsed);

    setForm({
      name: parsed.user_name || "",
      email: parsed.email || "",
      dob: parsed.birthday ? parsed.birthday.split("T")[0] : "",
    });
  }, []);

  /* ===== HANDLE CHANGE ===== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleEdit = (field: keyof typeof editing) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const token = Cookies.get("token");
    if (!token) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    const updatedData: any = {};

    if (form.name !== user.user_name) {
      updatedData.user_name = form.name;
    }

    if (form.email !== user.email) {
      updatedData.email = form.email;
    }

    if (form.dob !== (user.birthday?.split("T")[0] || "")) {
      updatedData.birthday = form.dob;
    }

    if (Object.keys(updatedData).length === 0) {
      alert("Không có thay đổi nào để lưu.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/users/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const result = await res.json();

      alert("Cập nhật thành công!");

      // update local state + localStorage
      setUser(result.data);
      localStorage.setItem("user", JSON.stringify(result.data));

      setEditing({ name: false, email: false, dob: false });
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi cập nhật thông tin!");
    }
  };

  /* ===== RENDER ===== */
  return (
    <ProfilePage>
      <section className={styles.profileForm}>
        <h3>Hồ Sơ Của Tôi</h3>
        <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

        <form onSubmit={handleSubmit}>
          {/* ===== NAME ===== */}
          <label className={styles.row}>
            <span>Tên</span>
            <div className={styles.inputGroup}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editing.name}
              />
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => toggleEdit("name")}
              >
                {editing.name ? <X size={18} /> : <Pencil size={18} />}
              </button>
            </div>
          </label>

          {/* ===== EMAIL ===== */}
          <label className={styles.row}>
            <span>Email</span>
            <div className={styles.inputGroup}>
              <input
                name="email"
                value={
                  editing.email
                    ? form.email
                    : form.email.replace(
                        /(.{2})(.*)(?=@)/,
                        (_, a, b) => a + "*".repeat(b.length)
                      )
                }
                onChange={handleChange}
                disabled={!editing.email}
              />
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => toggleEdit("email")}
              >
                {editing.email ? <X size={18} /> : <Pencil size={18} />}
              </button>
            </div>
          </label>

          {/* ===== DOB ===== */}
          <label className={styles.row}>
            <span>Ngày sinh</span>
            <div className={styles.inputGroup}>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                disabled={!editing.dob}
              />
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => toggleEdit("dob")}
              >
                {editing.dob ? <X size={18} /> : <Pencil size={18} />}
              </button>
            </div>
          </label>

          <button type="submit" className={styles.saveBtn}>
            Lưu thay đổi
          </button>
        </form>
      </section>
    </ProfilePage>
  );
}
