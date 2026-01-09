"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./QuestionCreate.module.css";
import { Button } from "@/component/ui/button/Button";
import { QuestionService } from "@/domain/admin/questions/service";
import type { AnswerForm, QuestionForm } from "@/domain/admin/questions/type";
import MultipleChoiceAnswers from "@/component/formQuestionAnswer/MultipleChoiceAnswers";
import EssayAnswer from "@/component/formQuestionAnswer/EssayAnswer";
import SingleChoice from "@/component/formQuestionAnswer/SingleChoice";
import NotificationPopup from "@/component/notification/Notification";
import { typeNoti } from "@/lib/model";

export default function QuestionCreate() {
    const router = useRouter();
    const [notify, setNotify] = useState<typeNoti | null>(null);
    /* ===== QUESTION FORM ===== */
    const [form, setForm] = useState<QuestionForm>({
        question_content: "",
        available: true,
        source: "",
        type_question: 1, // 1: MC, 2: True/False, 3: Essay
    });

    /* ===== ANSWERS ===== */
    const [answers, setAnswers] = useState<AnswerForm[]>([
        { answer_content: "", is_correct: false },
    ]);

    /* ===== QUESTION IMAGES ===== */
    const [questionImages, setQuestionImages] = useState<File[] | string[]>([]);
    const [answerImages, setAnswerImages] = useState<File[] | string[]>([]);

    /* ===== HELPERS ===== */
    const updateForm = (key: keyof QuestionForm, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    /* ===== RESET ANSWERS WHEN TYPE CHANGES ===== */
    useEffect(() => {
        if (form.type_question !== 3) {
            setAnswers([
                { answer_content: "", is_correct: false },
                { answer_content: "", is_correct: false },
                { answer_content: "", is_correct: false },
                { answer_content: "", is_correct: false },
            ]);
        }

        if (form.type_question === 3) {
            setAnswers([
                { answer_content: "", is_correct: true },
            ]);
        }
    }, [form.type_question]);

    /* ===== SUBMIT ===== */
    const handleSubmit = async () => {
        if (!form.question_content.trim()) {
            setNotify({
                message: "Vui lòng nhập nội dung câu hỏi",
                type: "warning",
            })
            return;
        }

        if (form.type_question !== 3) {
            if (answers.length < 4) {
                setNotify({
                    message: "Cần ít nhất 4 đáp án",
                    type: "warning",
                })
                return;
            }

            if (!answers.some((a) => a.is_correct)) {
                setNotify({
                    message: "Phải có ít nhất 1 đáp án đúng",
                    type: "warning",
                })
                return;
            }
        }
        else {
            if (!answers[0]?.answer_content.trim()) {
                setNotify({
                    message: "Vui lòng nhập đáp án tự luận",
                    type: "warning",
                })
                return;
            }
        }

        try {
            // Upload images
            const imageLinks =
                questionImages.length > 0
                    ? await QuestionService.uploadImages(questionImages)
                    : [];
            const imageLinksAnswer = answerImages.length > 0
                ?
                await QuestionService.uploadImages(answerImages)
                : []

            // Create question
            await QuestionService.createQuestionWithAnswers({
                ...form,
                images: imageLinks,
                answers: answers.map(a => ({
                    ...a,
                    images: imageLinksAnswer
                })),
            });
            router.push("/admin/questions");
            setNotify({
                message: "Tạo câu hỏi thành công!",
                type: "success",
            })
        } catch (err) {
            console.error(err);
            setNotify({
                message: "Lỗi khi tạo câu hỏi",
                type: "error",
            })
        }
    };

    /* ===== RENDER ===== */
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tạo câu hỏi</h1>

            {/* QUESTION CONTENT */}
            <label className={styles.label}>Nội dung câu hỏi</label>
            <textarea
                className={styles.textarea}
                rows={5}
                value={form.question_content}
                onChange={(e) => updateForm("question_content", e.target.value)}
            />

            {/* IMAGES */}
            <div className={styles.uploadImages}>
                <label className={styles.label}>Hình ảnh câu hỏi</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        if (!e.target.files) return;
                        setQuestionImages(Array.from(e.target.files));
                    }}
                />
            </div>

            <div className={styles.previewWrap}>
                {questionImages.map((img, i) => (
                    <img
                        key={i}
                        src={URL.createObjectURL(img as Blob)}
                        className={styles.preview}
                        alt="preview"
                    />
                ))}
            </div>

            {/* QUESTION TYPE */}
            <label className={styles.label}>Loại câu hỏi</label>
            <div className={styles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        checked={form.type_question === 1}
                        onChange={() => updateForm("type_question", 1)}
                    />
                    Trắc nghiệm
                </label>

                <label>
                    <input
                        type="radio"
                        checked={form.type_question === 2}
                        onChange={() => updateForm("type_question", 2)}
                    />
                    Đúng / Sai
                </label>

                <label>
                    <input
                        type="radio"
                        checked={form.type_question === 3}
                        onChange={() => updateForm("type_question", 3)}
                    />
                    Tự luận
                </label>
            </div>

            {/* ANSWERS */}
            {form.type_question === 2 && (
                <MultipleChoiceAnswers answers={answers}
                    setAnswers={setAnswers}
                    answerImages={answerImages}
                    setAnswerImages={setAnswerImages} />
            )}

            {form.type_question === 1 && (
                <SingleChoice answers={answers}
                    setAnswers={setAnswers}
                    answerImages={answerImages}
                    setAnswerImages={setAnswerImages} />
            )}

            {form.type_question === 3 && (
                <EssayAnswer answers={answers}
                    setAnswers={setAnswers}
                    answerImages={answerImages}
                    setAnswerImages={setAnswerImages} />
            )}

            {/* ACTIONS */}
            <div className={styles.actions}>
                <Button variant="secondary" onClick={() => router.back()}>
                    Huỷ
                </Button>

                <Button variant="primary" onClick={handleSubmit}>
                    Lưu câu hỏi
                </Button>
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
