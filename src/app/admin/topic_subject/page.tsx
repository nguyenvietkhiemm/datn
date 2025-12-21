"use client";
import { useEffect, useState } from "react";
import SubjectManager from "@/component/subject/page";
import TopicManager from "@/component/topic/page";
import { Topic, Subject } from "@/domain/admin/topic_subject/type";
import { TopicSubjectService } from "@/domain/admin/topic_subject/service";

export default function TopicSubject() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

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
    const createSubject = async (name: string) => {
        const s = await TopicSubjectService.createSubject(name);
        setSubjects((prev) => [...prev, s]);
    };

    const updateSubject = async (id: number, name: string) => {
        await TopicSubjectService.updateSubject(id, name);
        setSubjects((prev) =>
            prev.map((s) => (s.subject_id === id ? { ...s, subject_name: name } : s))
        );
    };

    const deleteSubject = async (id: number) => {
        await TopicSubjectService.deleteSubject(id);
        setSubjects((prev) => prev.filter((s) => s.subject_id !== id));
        setTopics((prev) => prev.filter((t) => t.subject_id !== id));
    };

    /* ===== TOPIC API ===== */
    const createTopic = async (payload: Partial<Topic>) => {
        const t = await TopicSubjectService.createTopic(
            payload.title!,
            payload.description!,
            payload.subject_id
        );
        setTopics((prev) => [...prev, t]);
    };

    const updateTopic = async (id: number, payload: Partial<Topic>) => {
        const updated = await TopicSubjectService.updateTopic(id, payload);
        setTopics((prev) =>
            prev.map((t) => (t.topic_id === id ? { ...t, ...updated } : t))
        );
    };

    const deleteTopic = async (id: number) => {
        await TopicSubjectService.deleteTopic(id);
        setTopics((prev) => prev.filter((t) => t.topic_id !== id));
    };

    return (
        <>
            <SubjectManager
                subjects={subjects}
                onCreate={createSubject}
                onUpdate={updateSubject}
                onDelete={deleteSubject}
            />

            <TopicManager
                topics={topics}
                subjects={subjects}
                onCreate={createTopic}
                onUpdate={updateTopic}
                onDelete={deleteTopic}
            />
        </>
    );
}
