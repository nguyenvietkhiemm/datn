"use client";

import { useEffect, useState } from "react";
import styles from "./User.module.css";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function User() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // controlled states; initialize with defined values to avoid uncontrolled -> controlled
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [filterRole, setFilterRole] = useState<string>("all");

  useEffect(() => {
    // Mock API data — replace with fetch(...) later
    setTimeout(() => {
      setUsers([
        { id: 1, name: "Nguyễn Văn A", email: "vana@example.com", role: "user" },
        { id: 2, name: "Trần Thị B", email: "tranb@example.com", role: "user" },
        { id: 3, name: "Admin", email: "admin@example.com", role: "admin" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <p className={styles.user_loading}>Đang tải danh sách người dùng...</p>;

  // Filter users by role and search term (case-insensitive)
  const filteredUsers = users.filter((user) => {
    const matchRole = filterRole === "all" || user.role === filterRole;
    const q = searchTerm.trim().toLowerCase();
    const matchSearch =
      q === "" ||
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <div className={styles.user_container}>
      <div className={styles.user_header}>
        <h1 className={styles.title}>Quản lý người dùng</h1>
        <div className={styles.user_add_search}>
          <div className={styles.button}>
            <button className={styles.user_addButton}>+ Thêm người dùng</button>
          </div>

          <div className={styles.search_and_filter}>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className={styles.select}
            >
              <option value="all">Tất cả</option>
              <option value="admin">Người quản lý</option>
              <option value="user">Người dùng</option>
            </select>

            {/* INPUT is controlled — value always a string */}
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <table className={styles.user_table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className={user.role === "admin" ? styles.admin : styles.user}>
                  {user.role === "admin" ? "Admin" : "Người dùng"}
                </td>
                <td>
                  <button className={styles.smallBtn}>Sửa</button>
                  <button className={styles.delBtn}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={styles.empty}>
                Không có người dùng phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
