"use client";

import { useEffect, useState } from "react";
import styles from "./Topic.module.css";
import { TopicSubjectService } from "@/domain/admin/topic_subject/service";
import type { Topic, Subject } from "@/domain/admin/topic_subject/type";
import { TopicSubjectModel } from "@/domain/admin/topic_subject/model";

type TopicProp = {
    topics: Topic[],
    setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
}

export default function TopicManager({ topics, setTopics }: TopicProp) {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    // Form add topic
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newSubject, setNewSubject] = useState<number | null>(null);
    // Editing
    const [editingTopicId, setEditingTopicId] = useState<number | null>(null);
    const [editTopic, setEditTopic] = useState<Partial<Topic>>({});
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
        subject_id?: string
    }>({});

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        try {
            const topicData = await TopicSubjectService.fetchTopics();
            const subjectData = await TopicSubjectService.fetchSubjects();
            setTopics(topicData);
            setSubjects(subjectData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async () => {
        try {
            const isValid = TopicSubjectModel.validate(
                {
                    title: newTitle,
                    description: newDesc,
                    subject_id: newSubject,
                },
                {
                    title: true,
                    description: true,
                    subject: true,
                },
                setErrors
            );

            if (!isValid) return;

            const topic = await TopicSubjectService.createTopic(
                newTitle,
                newDesc,
                newSubject ?? undefined
            );

            setTopics((prev) => [...prev, topic]);
            setNewTitle("");
            setNewDesc("");
            setNewSubject(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async (id: number) => {
        try {
            const updated = await TopicSubjectService.updateTopic(id, editTopic);

            setTopics((prev) =>
                prev.map((t) => (t.topic_id === id ? { ...t, ...updated } : t))
            );

            setEditingTopicId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Xoá topic?")) return;

        try {
            await TopicSubjectService.deleteTopic(id);
            setTopics((prev) => prev.filter((t) => t.topic_id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Topic</h2>

            {/* FORM ADD */}
            <div className={styles.formRow}>
                <input
                    type="text"
                    placeholder="Tiêu đề..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                {errors.title && <p className={styles.error}>{errors.title}</p>}

                <input
                    type="text"
                    placeholder="Mô tả..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                />
                {errors.description && <p className={styles.error}>{errors.description}</p>}

                <select
                    value={newSubject ?? ""}
                    onChange={(e) =>
                        setNewSubject(e.target.value ? Number(e.target.value) : null)
                    }
                >
                    <option value="">— Subject —</option>
                    {subjects.map((s) => (
                        <option value={s.subject_id} key={s.subject_id}>
                            {s.subject_name}
                        </option>
                    ))}
                </select>
                {errors.subject_id && <p className={styles.error}>{errors.subject_id}</p>}

                <button onClick={handleCreate}>Thêm Topic</button>
            </div>

            {/* TABLE */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Mô tả</th>
                        <th>Môn học</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {topics?.map((t) => (
                        <tr key={t.topic_id}>
                            <td>{t.topic_id}</td>

                            {/* TITLE */}
                            <td>
                                {editingTopicId === t.topic_id ? (
                                    <input
                                        value={editTopic.title ?? ""}
                                        onChange={(e) =>
                                            setEditTopic((prev) => ({
                                                ...prev,
                                                title: e.target.value
                                            }))
                                        }
                                    />
                                ) : (
                                    t.title
                                )}
                            </td>

                            {/* DESCRIPTION */}
                            <td>
                                {editingTopicId === t.topic_id ? (
                                    <input
                                        value={editTopic.description ?? ""}
                                        onChange={(e) =>
                                            setEditTopic((prev) => ({
                                                ...prev,
                                                description: e.target.value
                                            }))
                                        }
                                    />
                                ) : (
                                    t.description
                                )}
                            </td>

                            {/* SUBJECT SELECT */}
                            <td>
                                {editingTopicId === t.topic_id ? (
                                    <select
                                        value={editTopic.subject_id ?? ""}
                                        onChange={(e) =>
                                            setEditTopic((prev) => ({
                                                ...prev,
                                                subject_id: e.target.value
                                                    ? Number(e.target.value)
                                                    : null
                                            }))
                                        }
                                    >
                                        <option value="">— None —</option>
                                        {subjects.map((s) => (
                                            <option key={s.subject_id} value={s.subject_id}>
                                                {s.subject_name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    subjects.find((s) => s.subject_id === t.subject_id)
                                        ?.subject_name ?? "—"
                                )}
                            </td>

                            <td>
                                {editingTopicId === t.topic_id ? (
                                    <>
                                        <button className={styles.saveBtn} onClick={() => handleSave(t.topic_id)}>
                                            Lưu
                                        </button>
                                        <button className={styles.cancelBtn} onClick={() => setEditingTopicId(null)}>
                                            Huỷ
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => {
                                                setEditingTopicId(t.topic_id);
                                                setEditTopic({
                                                    title: t.title,
                                                    description: t.description,
                                                    subject_id: t.subject_id
                                                });
                                            }}
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(t.topic_id)}
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
