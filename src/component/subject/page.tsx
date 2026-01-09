"use client";

import { useState } from "react";
import styles from "./Subject.module.css";
import type { Subject } from "@/domain/admin/topic_subject/type";
import { TopicSubjectModel } from "@/domain/admin/topic_subject/model";

type Props = {
  subjects: Subject[];
  onCreate: (name: string, subject_type: number) => void;
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
  const [subject_type, setSubject_type] = useState<number>(1);
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

    onCreate(newName, subject_type);
    setNewName("");
    setSubject_type(1);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Môn học</h2>

      {/* Form thêm môn học */}
      <div className={styles.formRow}>
        <input
          className={errors.title ? styles.inputError : ""}
          placeholder="Tên môn học..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <select
          value={subject_type}
          onChange={(e) => setSubject_type(Number(e.target.value))}
        >
          <option value={1}>Loại 1</option>
          <option value={2}>Loại 2</option>
        </select>

        <button className={styles.buttonPrimary} onClick={handleCreate}>
          Thêm
        </button>
      </div>
      {errors.title && <p className={styles.error}>{errors.title}</p>}

      {/* Table môn học */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên môn học</th>
            <th>Loại môn học</th>
            <th>Sửa</th>
            <th>Xoá</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((s,index) => (
            <tr key={index}>
              <td>{index + 1}</td>

              <td>
                {editingId === s.subject_id ? (
                  <input
                    className={styles.inlineInput}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  s.subject_name
                )}
              </td>

              <td>{s.subject_type}</td>

                {editingId === s.subject_id ? (
                  <>
                    <td>
                      <button
                        className={styles.saveBtn}
                        onClick={() => {
                          onUpdate(s.subject_id, editName);
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
                          setEditingId(s.subject_id);
                          setEditName(s.subject_name);
                        }}
                      >
                        Sửa
                      </button>
                    </td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => {
                          onDelete(s.subject_id);
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
