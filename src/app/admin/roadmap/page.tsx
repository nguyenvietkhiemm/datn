"use client";
import { useEffect, useState } from "react";
import styles from "./Roadmap.module.css";
import { Button } from "@/component/ui/button/Button";
import { RoadmapStep } from "@/domain/admin/roadmap/type";
import { Topic } from "@/domain/admin/topic_subject/type";
import { RoadMapService } from "@/domain/admin/roadmap/service";
import { TopicSubjectService } from "@/domain/admin/topic_subject/service";

export default function RoadmapEditor() {
    const [steps, setSteps] = useState<RoadmapStep[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        topic_id: "",
    });

    // lay roadmapco san
    useEffect(() => {
        const fetchRoadmap = async () => {
            const roadmap = await RoadMapService.fetchRoadmap();
            setSteps(roadmap)
        }

        const fetchTopic = async () => {
            const resTopic = await TopicSubjectService.fetchTopics()
            setTopics(resTopic)
        }

        fetchRoadmap();
        fetchTopic();
    }, [])

    // Thay đổi form
    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Thêm bước
    const handleAdd = async () => {
        const roadmap = await RoadMapService.addStep(form)
        setSteps(prev => [...prev, roadmap])
    }

    // Xoá bước
    const deleteStep = async(roadmap_step_id: any) => {
        try {
          await RoadMapService.deleteStep(roadmap_step_id)
        } catch (error) {
            console.log("error: ", error);
        }
        setSteps(steps.filter((s) => s.roadmap_step_id !== roadmap_step_id));
    };

    // Chọn sửa
    const startEdit = (step: any) => {
        setEditId(step.roadmap_step_id);
        setForm({
            title: step.title,
            description: step.description,
            topic_id: step.topic_id ?? "",
        });
    };

    // Lưu sửa
    const saveEdit = async() => {
        try {
            if (editId === null) return;
            await RoadMapService.updateStep(editId, form)
        } catch (error) {
            console.log("error: ", error );
        }
        setSteps(
            steps.map((s) =>
                s.roadmap_step_id === editId
                    ? {
                        ...s,
                        title: form.title,
                        description: form.description,
                        topic_id: Number(form.topic_id)
                    }
                    : s
            )
        );

        setEditId(null);
        setForm({ title: "", description: "", topic_id: "" });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>QUẢN LÝ ROADMAP</h2>

            <div className={styles.form}>
                <textarea
                    name="title"
                    placeholder="Tiêu đề bước..."
                    value={form.title}
                    onChange={handleChange}
                    className={styles.textarea}
                />

                <textarea
                    name="description"
                    placeholder="Mô tả..."
                    value={form.description}
                    onChange={e => {
                        handleChange(e)
                        e.target.style.height = "auto";   
                        e.target.style.height = e.target.scrollHeight + "px"
                    }}
                    className={styles.textarea}
                />

                <select
                    name="topic_id"
                    value={form.topic_id}
                    onChange={handleChange}
                    className={styles.selectDropdown}
                >
                    <option value="">Chọn tiêu đề</option>
                    {topics?.map((t) => (
                        <option key={t.topic_id} value={t.topic_id}>{t.title}</option>
                    ))}
                </select>

                {editId ? (
                    <Button onClick={saveEdit}>
                        Lưu
                    </Button>
                ) : (
                    <Button onClick={() => handleAdd()} >
                        Thêm
                    </Button>
                )}
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Bước</th>
                           
                            <th>Mô tả</th>
                         
                            <th>Chỉnh sửa</th>
                            <th>Xoá</th>
                        </tr>
                    </thead>

                    <tbody>
                        {steps?.map((step, index) => (
                            <tr key={step.roadmap_step_id}>
                                <td>{index + 1}</td>
                                
                                <td>{step.description}</td>
                           

                                <td>
                                    <span className={styles.edit} onClick={() => startEdit(step)}>...</span>
                                </td>
                                <td>
                                   <span className={styles.remove} onClick={() => deleteStep(step.roadmap_step_id)}>X</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
