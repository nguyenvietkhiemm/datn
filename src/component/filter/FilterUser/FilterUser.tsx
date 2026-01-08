"use client";

import { useEffect, useState } from "react";
import styles from "./FilterUser.module.css";
import type { UserQuery } from "@/domain/admin/users/type";

interface FilterUserProps {
    query: UserQuery;
    setQuery: React.Dispatch<React.SetStateAction<UserQuery>>;
}

export default function FilterUser({ query, setQuery }: FilterUserProps) {
    // ===== LOCAL STATE (EDIT MODE) =====
    const [search, setSearch] = useState<string>(query.keyword ?? "");
    const [role, setRole] = useState<"All" | "ADMIN" | "USER">(
        query.role ?? "All"
    );
    const [status, setStatus] = useState<"All" | "true" | "false">(
        query.status ?? "All"
    );

    // ===== SYNC KHI QUERY ĐỔI (pagination / back / reload) =====
    useEffect(() => {
        setSearch(query.keyword ?? "");
        setRole(query.role ?? "All");
        setStatus(query.status ?? "All");
    }, [query.keyword, query.role, query.status]);

    const applyFilter = () => {
        setQuery((prev) => ({
            ...prev,
            page: 1,
            keyword: search.trim() || undefined,
            role: role !== "All" ? role : undefined,
            status: status !== "All" ? status : undefined,
        }));
    };

    const resetFilter = () => {
        setSearch("");
        setRole("All");
        setStatus("All");
        setQuery({ page: 1 });
    };

    return (
        <div className={styles.container}>
            {/* Search */}
            <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.input}
            />

            {/* Role */}
            <select
                value={role}
                onChange={(e) =>
                    setRole(e.target.value as "All" | "ADMIN" | "USER")
                }
                className={styles.select}
            >
                <option value="All">Tất cả vai trò</option>
                <option value="2">Người quản lý</option>
                <option value="1">Người dùng</option>
            </select>

            {/* Status */}
            <select
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value as "All" | "true" | "false")
                }
                className={styles.select}
            >
                <option value="All">Tất cả trạng thái</option>
                <option value="true">Hoạt động</option>
                <option value="false">Bị khoá</option>
            </select>

            <button onClick={applyFilter} className={styles.applyBtn}>
                Áp dụng
            </button>

            <button onClick={resetFilter} className={styles.clearBtn}>
                Đặt lại
            </button>
        </div>
    );
}
