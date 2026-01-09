"use client";

import { useState } from "react";
import styles from "./Topic.module.css";
import type { Topic, Subject } from "@/domain/admin/topic_subject/type";
import { TopicSubjectModel } from "@/domain/admin/topic_subject/model";

type Props = {
  topics: Topic[];
  subjects: Subject[];
  onCreate: (t: Partial<Topic>) => void;
  onUpdate: (id: number, t: Partial<Topic>) => void;
  onDelete: (id: number) => void;
};

export default function TopicManager({
  topics,
  subjects,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSubject, setNewSubject] = useState<number | undefined>(undefined);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTopic, setEditTopic] = useState<Partial<Topic>>({});
  const [errors, setErrors] = useState<any>({});

  const handleCreate = () => {
    const valid = TopicSubjectModel.validate(
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

    if (!valid) return;

    onCreate({
      title: newTitle,
      description: newDesc,
      subject_id: newSubject,
    });

    setNewTitle("");
    setNewDesc("");
    setNewSubject(undefined);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Chủ đề</h2>

      {/* FORM ADD */}
      <div className={styles.formRow}>
        <input
          className={errors.title ? styles.inputError : ""}
          placeholder="Tiêu đề..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          className={errors.description ? styles.inputError : ""}
          placeholder="Mô tả..."
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <select
          className={errors.subject ? styles.inputError : ""}
          value={newSubject ?? ""}
          onChange={(e) =>
            setNewSubject(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        >
          <option value="">— Chọn môn học —</option>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        <button className={styles.buttonPrimary} onClick={handleCreate}>
          Thêm
        </button>
      </div>
      {Object.values(errors).length > 0 && (
        <p className={styles.error}>
          Vui lòng điền đầy đủ thông tin trước khi thêm
        </p>
      )}

      {/* TABLE */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Môn học</th>
            <th>Sửa</th>
            <th>Xoá</th>
          </tr>
        </thead>

        <tbody>
          {topics.map((t, index) => (
            <tr key={index}>
              <td>{index + 1}</td>

              <td>
                {editingId === t.topic_id ? (
                  <input
                    className={styles.inlineInput}
                    value={editTopic.title ?? ""}
                    onChange={(e) =>
                      setEditTopic((p) => ({ ...p, title: e.target.value }))
                    }
                  />
                ) : (
                  t.title
                )}
              </td>

              <td>
                {editingId === t.topic_id ? (
                  <input
                    className={styles.inlineInput}
                    value={editTopic.description ?? ""}
                    onChange={(e) =>
                      setEditTopic((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                  />
                ) : (
                  t.description
                )}
              </td>

              <td>
                {editingId === t.topic_id ? (
                  <select
                    className={styles.inlineSelect}
                    value={editTopic.subject_id ?? ""}
                    onChange={(e) =>
                      setEditTopic((p) => ({
                        ...p,
                        subject_id: Number(e.target.value),
                      }))
                    }
                  >
                    <option value="">— Chọn môn học —</option>
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

              {editingId === t.topic_id ? (
                <>
                  <td>
                    <button
                      className={styles.saveBtn}
                      onClick={() => {
                        onUpdate(t.topic_id, editTopic);
                        setEditingId(null);
                      }}
                    >
                      Lưu
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setEditingId(null)}
                    >
                      Huỷ
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => {
                        setEditingId(t.topic_id);
                        setEditTopic(t);
                      }}
                    >
                      Sửa
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => {
                        onDelete(t.topic_id);
                      }}
                    >
                      Xoá
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
