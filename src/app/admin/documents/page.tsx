"use client";

import { useEffect, useState } from "react";
import styles from "./Document.module.css";
import Filter from "@/component/filter/Filter/Filter";
import { useRouter } from "next/navigation";
import Search from "@/component/search/Search";
import Pagination from "@/component/pagination/Pagination";
import { Document } from "@/domain/admin/documents/types";
import { DocumentService } from "@/domain/admin/documents/service";

export default function DocumentPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDoc, setFilterDoc] = useState<Document[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [filterCondition, setFilterCondition] = useState<any>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const router = useRouter();

    // Lấy danh sách tài liệu
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const data = await DocumentService.fetchDocuments(currentPage)
                setDocuments(data.documents);
                setTotalPage(data.last_page || 1);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [currentPage]);

    // Lọc tài liệu đang hoạt động
    useEffect(() => {
        setFilterDoc(documents?.filter((d) => d.available === true));
    }, [documents]);

    // Xoá tài liệu
    const handleDelete = async (docId: number) => {
        try {
            await DocumentService.deleteDocument(docId)
            setDocuments((prev) => prev.filter((d) => d.document_id !== docId));
        } catch (err) {
            console.error(err);
        }
    };

    // Chuyển trạng thái hoạt động
    const handleToggleAvailable = async (docId: number, available: boolean) => {
        try {
            await DocumentService.toggleDocumentAvailable(docId, available)

            setDocuments((prev) =>
                prev.map((d) =>
                    d.document_id === docId ? { ...d, available } : d
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Xem chi tiết tài liệu
    const detailDocument = (id: number, document: Document) => {
        localStorage.setItem("document", JSON.stringify(document));
        router.push(`/admin/documents/detail/${id}`);
    };

    if (loading)
        return <p className={styles.loading}>Đang tải danh sách tài liệu...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quản lý tài liệu</h1>
                <div className={styles.actions}>
                    <div
                        className={styles.button}
                        onClick={() => router.push("/admin/documents/create")}
                    >
                        <button className={styles.addButton}>+ Thêm tài liệu</button>
                    </div>

                    <div className={styles.filter_search}>
                        <Filter
                            setFilterCondition={setFilterCondition}
                            setSearchKeyword={setSearchKeyword}
                        />

                        <Search
                            setSearchKeyword={setSearchKeyword}
                            setFilterCondition={setFilterCondition}
                            typeSearch="document"
                        />

                    </div>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên tài liệu</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Chủ đề</th>
                        <th>Xem</th>
                        <th>Xoá</th>
                    </tr>
                </thead>
                <tbody>
                    {filterDoc?.length > 0 ? (
                        filterDoc.map((doc, index) => (
                            <tr
                                key={doc.document_id}
                                onClick={() => detailDocument(doc.document_id, doc)}
                            >
                                <td>{index + 1}</td>
                                <td>{doc.title}</td>
                                <td>{new Date(doc.created_at).toLocaleDateString("vi-VN")}</td>
                                <td
                                    className={doc.available ? styles.active : styles.inactive}
                                >
                                    {doc.available ? "Hoạt động" : "Không hoạt động"}
                                    <span
                                        className={styles.editIcon}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleAvailable(doc.document_id, !doc.available);
                                        }}
                                    >
                                        ✎
                                    </span>
                                </td>
                                <td>{doc.topic_title || "-"}</td>
                                <td>
                                    {doc.link ? (
                                        <a
                                            href={doc.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.viewBtn}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Xem
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={styles.delBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(doc.document_id);
                                        }}
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className={styles.empty}>
                                Không có tài liệu phù hợp
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination
                totalPages={totalPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
