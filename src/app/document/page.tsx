"use client";

import { useState, useEffect } from "react";
import styles from "./DocumentList.module.css";
import Filter from "@/components/filter/Filter";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";
import Cookies from "js-cookie";
import Link from "next/link";
import { FilterSearch } from "../../../lib/service";

interface Document {
    document_id: number;
    title: string;
    link?: string;
    created_at: string;
    topic_id?: number;
    available: boolean;
}

export default function DocumentList() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterCondition, setFilterCondition] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                let url = `${API_URL}/documents?page=${currentPage}`

                url = FilterSearch(filterCondition, searchKeyword, url);
                console.log(url);
                
                const res = await fetch(
                    url,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const json = await res.json();

                if (res.ok) {
                    setDocuments(json.data.documents);
                    setTotalPages(json.data.totalPages);
                } else {
                    console.error(json.message);
                }
            } catch (err) {
                console.error("Fetch documents failed:", err);
            }
        };

        fetchDocuments();
    }, [searchKeyword, filterCondition, currentPage]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tài liệu của tôi</h1>

            {/* Search + Filter */}
            <div className={styles.filter_search}>
                <Filter
                    setFilterCondition={setFilterCondition}
                    setSearchKeyword={setSearchKeyword}
                    setCurrentPage={setCurrentPage}
                />

                <Search
                    setSearchKeyword={setSearchKeyword}
                    setFilterCondition={setFilterCondition}
                />
            </div>

            {/* List */}
            <div className={styles.list}>
                {documents.length === 0 ? (
                    <p className={styles.empty}>Không có tài liệu nào phù hợp.</p>
                ) : (
                    documents.map((doc) => (
                        <div key={doc.document_id} className={styles.card}>
                            <h3 className={styles.docTitle}>{doc.title}</h3>

                            {doc.link ? (
                                <Link
                                    href={`/document/${doc.document_id}?link=${doc.link}`}
                                    target="_blank"
                                    className={styles.link}
                                >
                                    🔗 Xem tài liệu
                                </Link>
                            ) : (
                                <p className={styles.noLink}>Không có link</p>
                            )}

                            <p className={styles.date}>
                                📅 {new Date(doc.created_at).toLocaleString("vi-VN")}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    );
}
