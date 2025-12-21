"use client";

import { useState } from "react";
import styles from "./Subject.module.css";
import type { Subject } from "@/domain/admin/topic_subject/type";
import { TopicSubjectModel } from "@/domain/admin/topic_subject/model";

type Props = {
    subjects: Subject[];
    onCreate: (name: string) => void;
    onUpdate: (id: number, name: string) => void;
    onDelete: (id: number) => void;
};

export default function SubjectManager({
    subjects,
    onCreate,
    onUpdate,
    onDelete,
}: Props) {
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [errors, setErrors] = useState<{ title?: string }>({});

    const handleCreate = () => {
        const valid = TopicSubjectModel.validate(
            { title: newName },
            { title: true },
            setErrors
        );
        if (!valid) return;

        onCreate(newName);
        setNewName("");
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Subject</h2>

            <div className={styles.formRow}>
                <input
                    placeholder="Tên subject..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                {errors.title && <p className={styles.error}>{errors.title}</p>}
                <button onClick={handleCreate}>Thêm</button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((s) => (
                        <tr key={s.subject_id}>
                            <td>{s.subject_id}</td>

                            <td>
                                {editingId === s.subject_id ? (
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                ) : (
                                    s.subject_name
                                )}
                            </td>

                            <td>
                                {editingId === s.subject_id ? (
                                    <>
                                        <button
                                            className={styles.saveBtn}
                                            onClick={() => {
                                                onUpdate(s.subject_id, editName);
                                                setEditingId(null);
                                            }}
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            className={styles.cancelBtn}
                                            onClick={() => setEditingId(null)}
                                        >
                                            Huỷ
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => {
                                                setEditingId(s.subject_id);
                                                setEditName(s.subject_name);
                                            }}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => {
                                                if (confirm("Xoá subject?")) onDelete(s.subject_id);
                                            }}
                                        >
                                            Xoá
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}
