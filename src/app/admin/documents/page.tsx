"use client";

import { useEffect, useState } from "react";
import styles from "./Document.module.css";
import Filter from "@/component/filter/Filter/Filter";
import { useRouter } from "next/navigation";
import Search from "@/component/search/Search";
import Pagination from "@/component/pagination/Pagination";
import { Document, DocumnetQuery } from "@/domain/admin/documents/types";
import { DocumentService } from "@/domain/admin/documents/service";
import Link from "next/link";
import { formatVNDateTime, typeNoti } from "@/lib/model";
import NotificationPopup from "@/component/notification/Notification";

export default function DocumentPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [notify, setNotify] = useState<typeNoti | null>(null);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
    const [query, setQuery] = useState<DocumnetQuery>({
        page: 1,
        searchKeyword: "",
    });
    const [filterUI, setFilterUI] = useState({
        subject: "All" as number | "All",
        topic: "All" as number | "All",
        status: "All" as string,
    });
    const router = useRouter();

    // Lấy danh sách tài liệu
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const data = await DocumentService.fetchDocuments(query)
                setDocuments(data.documents);
                setTotalPage(data.last_page || 1);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [query]);

    // Xoá tài liệu
    const handleDelete = async (docId: number) => {
        try {
            await DocumentService.deleteDocument(docId)
            setNotify({
                message: (
                    <>
                        Bạn có chắc muốn xoá tài liệu không?
                    </>
                ),
                type: "warning",
                confirm: true,
                duration: 3000
            });
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

    const handleChngeSearch = (keyword: string) => {
        setQuery(prev => ({
            ...prev,
            page: 1,
            searchKeyword: keyword,
        }))
    };

    const handleChangeFilter = (filter: any) => {
        setQuery(prev => ({
            ...prev,
            page: 1,
            subject_id:
                filter.subject !== "All" ? filter.subject : undefined,
            topic_ids: filter.topic !== "All" ? filter.topic : undefined,
            status:
                filter.status !== "All" ? filter.status : undefined,
        }))
    };

    const handleSelectDocument = (document_id: number) => {
        setSelectedDocuments(prev => {
            const exist = prev.some(id => id === document_id)
            if (exist) return prev.filter(id => id !== document_id)
            return [...prev, document_id]
        })
    }

    const handleVectorizeSelected = async () => {
        if (selectedDocuments.length === 0) {
            setNotify({
                type: "warning",
                message: "Vui lòng chọn ít nhất 1 tài liệu để vectorize",
            });
            return;
        }

        const files = documents
            .filter(
                (doc): doc is Document & { link: string } =>
                    selectedDocuments.includes(doc.document_id) &&
                    typeof doc.link === "string"
            )
            .map(doc => ({
                document_id: doc.document_id,
                link: doc.link,
            }));

        if (files.length === 0) {
            setNotify({
                type: "error",
                message: "Các tài liệu đã chọn không có link hợp lệ",
            });
            return;
        }

        try {
            // 🔵 SHOW LOADING NOTI
            setNotify({
                type: "loading",
                message: "Đang vectorize tài liệu, vui lòng chờ...",
            });

            await DocumentService.vectorize(files);

            // 🟢 SUCCESS
            setNotify({
                type: "success",
                message: "Đã vectorize thành công!",
            });

            setSelectedDocuments([]);
        } catch (error) {
            console.error(error);

            // 🔴 ERROR
            setNotify({
                type: "error",
                message: "Vectorize thất bại. Vui lòng thử lại!",
            });
        }
    };



    if (loading)
        return <p className={styles.loading}>Đang tải danh sách tài liệu...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>QUẢN LÝ TÀI LIỆU</h1>

                <div className={styles.actions}>
                    <div className={styles.actionGroup}>
                        <button
                            className={styles.addButton}
                            onClick={() => router.push("/admin/documents/create")}
                        >
                            + Thêm tài liệu
                        </button>

                        <button
                            className={styles.vectorizeButton}
                            disabled={selectedDocuments.length === 0}
                            onClick={handleVectorizeSelected}
                        >
                            Vectorize ({selectedDocuments.length})
                        </button>
                    </div>

                    <div className={styles.filter_search}>
                        <Filter
                            value={filterUI}
                            onApply={(filter) => {
                                setFilterUI(filter)
                                handleChangeFilter(filter)
                            }}
                        />
                        <Search
                            searchKeyword={query.searchKeyword}
                            setSearchKeyword={handleChngeSearch}
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
                        <th>Chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {documents?.length > 0 ? (
                        documents.map((doc, index) => (
                            <tr
                                key={doc.document_id}
                            >
                                <td>{index + 1}</td>
                                <td>{doc.title}</td>
                                <td>{formatVNDateTime(doc.created_at)}</td>
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
                                <td >
                                    {doc.link ? (
                                        <Link href={`/admin/documents/${doc.document_id}?link=${doc.link}`}
                                            target="_blank"
                                            className={styles.link}
                                        >
                                            Xem tài liệu
                                        </Link>
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
                                        Xóa
                                    </button>
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedDocuments.includes(doc.document_id)}
                                        onChange={() => handleSelectDocument(doc.document_id)}
                                    />
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
                currentPage={query.page}
                setCurrentPage={(page: number) =>
                    setQuery(prev => ({ ...prev, page }))
                }
            />

            {notify && (
                <NotificationPopup
                    message={notify.message}
                    type={notify.type}
                    onClose={() => setNotify(null)}
                />
            )}
        </div>
    );
}
