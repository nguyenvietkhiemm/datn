"use client";
import { useEffect, useState } from "react";
import SubjectManager from "@/component/subject/page";
import TopicManager from "@/component/topic/page";
import { Topic, Subject } from "@/domain/admin/topic_subject/type";
import { TopicSubjectService } from "@/domain/admin/topic_subject/service";
import styles from "./TopicSubject.module.css"; // nếu dùng module
import NotificationPopup from "@/component/notification/Notification";
import { typeNoti } from "@/lib/model";

export default function TopicSubject() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [activeTab, setActiveTab] = useState<"subject" | "topic">("subject");
    const [notify, setNotify] = useState<typeNoti | null>(null);
    const loadAll = async () => {
        const [topicData, subjectData] = await Promise.all([
            TopicSubjectService.fetchTopics(),
            TopicSubjectService.fetchSubjects(),
        ]);
        setTopics(topicData);
        setSubjects(subjectData);
    };

    useEffect(() => {
        loadAll();
    }, []);

    /* ===== SUBJECT API ===== */
    const createSubject = async (name: string, subject_type: number) => {
        const s = await TopicSubjectService.createSubject(name, subject_type);
        setSubjects((prev) => [...prev, s]);
        setNotify({
            message: "Tạo môn học thành công",
            type: "success",
        })
    };

    const updateSubject = async (id: number, name: string) => {
        await TopicSubjectService.updateSubject(id, name);
        setSubjects((prev) =>
            prev.map((s) => (s.subject_id === id ? { ...s, subject_name: name } : s))
        );
        setNotify({
            message: "Cập nhật môn học thành công",
            type: "success",
        })
    };

    const deleteSubject = async (id: number) => {
        await TopicSubjectService.deleteSubject(id);
        setSubjects((prev) => prev.filter((s) => s.subject_id !== id));
        setTopics((prev) => prev.filter((t) => t.subject_id !== id));
        setNotify({
            message: "Xoá môn học thành công",
            type: "success",
        })
    };

    /* ===== TOPIC API ===== */
    const createTopic = async (payload: Partial<Topic>) => {
        const t = await TopicSubjectService.createTopic(
            payload.title!,
            payload.description!,
            payload.subject_id
        );
        setTopics((prev) => [...prev, t]);
        setNotify({
            message: "Tạo chủ đề thành công",
            type: "success",
        })
    };

    const updateTopic = async (id: number, payload: Partial<Topic>) => {
        const updated = await TopicSubjectService.updateTopic(id, payload);
        setTopics((prev) =>
            prev.map((t) => (t.topic_id === id ? { ...t, ...updated } : t))
        );
        setNotify({
            message: "Cập nhật chủ đề thành công",
            type: "success",
        })
    };

    const deleteTopic = async (id: number) => {
        await TopicSubjectService.deleteTopic(id);
        setTopics((prev) => prev.filter((t) => t.topic_id !== id));
        setNotify({
            message: "Xoá chủ đề thành công",
            type: "success",
        })
    };

    return (

        <div className={styles.container}>
            <h1 className={styles.pageTitle}>QUẢN LÝ MÔN & CHUYÊN ĐỀ</h1>

            <div className={styles.tabHeader}>
                <button className={`${styles.tabBtn} ${activeTab === "subject" ? styles.active : ""}`} onClick={() => setActiveTab("subject")}>Môn học</button>
                <button className={`${styles.tabBtn} ${activeTab === "topic" ? styles.active : ""}`} onClick={() => setActiveTab("topic")}>Chủ đề</button>
            </div>

            <div className="tabContent">
                {activeTab === "subject" && (
                    <SubjectManager
                        subjects={subjects}
                        onCreate={createSubject}
                        onUpdate={updateSubject}
                        onDelete={deleteSubject}
                    />
                )}
                {activeTab === "topic" && (
                    <TopicManager
                        topics={topics}
                        subjects={subjects}
                        onCreate={createTopic}
                        onUpdate={updateTopic}
                        onDelete={deleteTopic}
                    />
                )}
            </div>
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
