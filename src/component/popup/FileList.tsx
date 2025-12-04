"use client";

import styles from "./FileList.module.css";
import { useRouter } from "next/navigation";

interface FileInfo {
    id: number;
    name: string;
    url: string;
}

interface FileListProps {
    fileList: FileInfo[];
}

export default function FileList({ fileList }: FileListProps) {
    const router = useRouter();

    const handleOpenFile = (file: FileInfo) => {
        if (file.name.endsWith(".csv")) {
            router.push(`/admin/file-parser/csv/${encodeURIComponent(file.name)}`);
        } 
        else if (file.name.endsWith(".json")) {
            router.push(`/admin/file-parser/json/${encodeURIComponent(file.name)}`);
        } 
        else {
            alert("Định dạng file không được hỗ trợ!");
        }
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.FileTitle}>Danh sách file</h2>

            {fileList.length === 0 && (
                <p className={styles.hint}>Không có file nào trên server.</p>
            )}

            <div className={styles.FileContainer}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên file</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fileList?.map((file, index) => (
                                <tr key={file.id} 
                                onClick={() => handleOpenFile(file)} 
                                className={styles.fileRow}>
                                    <td> {index + 1}</td>
                                    <td> {file.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
