"use client";

import { useEffect, useState } from "react";
import styles from "./User.module.css";
import FilterUser from "@/component/filter/FilterUser/FilterUser";
import Pagination from "@/component/pagination/Pagination";
import type { User, UserQuery } from "@/domain/admin/users/type";
import { UserService } from "@/domain/admin/users/sevice";

export default function User() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [totalPage, setTotalPage] = useState(1);

  const [query, setQuery] = useState<UserQuery>({
    page: 1,
  });
  
  /* ================= FETCH BY QUERY ================= */
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { users, last_page } = await UserService.fetchUsers(query);
        setUsers(users);
        setTotalPage(last_page);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [query]);

  /* ================= ACTIONS ================= */

  const handleDelete = async (id: number) => {
    if (!confirm("Xoá người dùng?")) return;
    await UserService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.user_id !== id));
  };

  const handleToggleAvailable = async (id: number, available: boolean) => {
    await UserService.updateUser(id, { available });
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === id ? { ...u, available } : u
      )
    );
  };

  const handleChangeRole = async (id: number, role: "ADMIN" | "USER") => {
    await UserService.updateUser(id, { role_name: role });
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === id ? { ...u, role_name: role } : u
      )
    );
    setEditingRoleId(null);
  };

  if (loading)
    return (
      <p className={styles.user_loading}>
        Đang tải danh sách người dùng...
      </p>
    );
    
  return (
    <div className={styles.user_container}>
      <div className={styles.user_header}>
        <h1 className={styles.title}>QUẢN LÝ NGƯỜI DÙNG</h1>

        <FilterUser query={query} setQuery={setQuery} />
      </div>

      <table className={styles.user_table}>
        <thead>
          <tr>
            <th style={{ width: "40px", textAlign: "center" }}>STT</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Vai trò</th>
            <th>Xoá</th>
          </tr>
        </thead>

        <tbody>
          {users.length ? (
            users.map((u, i) => {
              const isAdmin = u.role_name === "ADMIN";

              return (
                <tr key={u.user_id}>
                  <td>{i + 1}</td>
                  <td>{u.user_name}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.birthday
                      ? new Date(u.birthday).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td>
                    {new Date(u.created_at).toLocaleString("vi-VN")}
                  </td>

                  <td className={u.available ? styles.active : styles.inactive}>
                    {u.available ? "Hoạt động" : "Bị khoá"}
                    {!isAdmin && (
                      <span
                        className={styles.editIcon}
                        onClick={() =>
                          handleToggleAvailable(
                            u.user_id,
                            !u.available
                          )
                        }
                      >
                        ✎
                      </span>
                    )}
                  </td>

                  <td className={isAdmin ? styles.admin : styles.user}>
                    {isAdmin ? "Admin" : "Người dùng"}
                    {!isAdmin && (
                      <span
                        className={styles.editIcon}
                        onClick={() =>
                          setEditingRoleId(
                            editingRoleId === u.user_id
                              ? null
                              : u.user_id
                          )
                        }
                      >
                        ✎
                      </span>
                    )}

                    {editingRoleId === u.user_id && (
                      <select
                        defaultValue={u.role_name}
                        onChange={(e) =>
                          handleChangeRole(
                            u.user_id,
                            e.target.value as "ADMIN" | "USER"
                          )
                        }
                      >
                        <option value="USER">Người dùng</option>
                        <option value="ADMIN">Quản trị</option>
                      </select>
                    )}
                  </td>

                  <td>
                    <button
                      className={styles.delBtn}
                      onClick={() => handleDelete(u.user_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className={styles.empty}>
                Không có người dùng
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        totalPages={totalPage}
        currentPage={query.page}
        setCurrentPage={(page) =>
          setQuery((prev) => ({ ...prev, page }))
        }
      />
    </div>
  );
}
