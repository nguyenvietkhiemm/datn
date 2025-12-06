"use client";

import { useEffect, useState } from "react";
import styles from "./Subject.module.css";
import { TopicSubjectService } from "@/domain/admin/topic_subject/service";
import type { Subject } from "@/domain/admin/topic_subject/type";
import { TopicSubjectModel } from "@/domain/admin/topic_subject/model";

export default function SubjectManager() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [newSubjectName, setNewSubjectName] = useState("");
    const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
    const [editSubjectName, setEditSubjectName] = useState("");
    const [errors, setErrors] = useState<{ 
        title?: string; 
        description?: string; 
        subject_id?: string 
    }>({});

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const data = await TopicSubjectService.fetchSubjects();
            setSubjects(data);
        } catch (error) {
            console.error("Failed load subjects:", error);
        }
    };

    const handleCreate = async () => {
        try {
            const isValid = TopicSubjectModel.validate(
                {
                    title: newSubjectName,
                },
                {
                    title: true,
                    description: false,
                    subject: false,
                },
                setErrors
            );
            
            if (!isValid) return;
            const result = await TopicSubjectService.createSubject(newSubjectName);
            setSubjects((prev) => [...prev, result]);
            setNewSubjectName("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async (id: number) => {
        try {
            await TopicSubjectService.updateSubject(id, editSubjectName);
            setSubjects((prev) =>
                prev.map((s) =>
                    s.subject_id === id ? { ...s, subject_name: editSubjectName } : s
                )
            );
            setEditingSubjectId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Xoá subject?")) return;

        try {
            await TopicSubjectService.deleteSubject(id);
            setSubjects((prev) => prev.filter((s) => s.subject_id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Subject</h2>

            <div className={styles.formRow}>
                <input
                    type="text"
                    value={newSubjectName}
                    placeholder="Tên subject..."
                    onChange={(e) => setNewSubjectName(e.target.value)}
                />

                {errors.title && <p className={styles.error}>{errors.title}</p>}
                
                <button onClick={handleCreate}>Thêm Subject</button>
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
                                {editingSubjectId === s.subject_id ? (
                                    <input
                                        value={editSubjectName}
                                        onChange={(e) => setEditSubjectName(e.target.value)}
                                    />
                                ) : (
                                    s.subject_name
                                )}
                            </td>

                            <td>
                                {editingSubjectId === s.subject_id ? (
                                    <>
                                        <button
                                            className={styles.saveBtn}
                                            onClick={() => handleSave(s.subject_id)}
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            className={styles.cancelBtn}
                                            onClick={() => setEditingSubjectId(null)}
                                        >
                                            Huỷ
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => {
                                                setEditingSubjectId(s.subject_id);
                                                setEditSubjectName(s.subject_name);
                                            }}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(s.subject_id)}
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
