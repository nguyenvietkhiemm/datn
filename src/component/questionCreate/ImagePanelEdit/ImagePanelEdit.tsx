"use client";

import styles from "./ImagePanelEdit.module.css";
import { ChangeValue } from "@/domain/admin/file/file-parser/type";
import { FileParserService } from "@/domain/admin/file/file-parser/service";
import { ImagePreview } from "../ImagePreview/page";

type ImageManagePanelProps = {
    rowIndex: number;
    questionImages?: string[];
    answers: {
        images?: string[];
    }[];
    handleChange: (
        rowIndex: number,
        type_change: number,
        value: ChangeValue
    ) => void;
    onClose: () => void;
    type_add: number;
    answerIndex?: number
};

export default function ImageManagePanel({
    rowIndex,
    questionImages = [],
    answers,
    handleChange,
    onClose,
    type_add,
    answerIndex
}: ImageManagePanelProps) {

    return (
        <div className={styles.overlay}>
            <div className={styles.panel}>
                {/* HEADER */}
                <div className={styles.header}>
                    <h3>Quản lý hình ảnh</h3>
                    <button onClick={onClose}>✖</button>
                </div>

                {/* ===== QUESTION IMAGES ===== */}
                <div className={styles.imageList}>
                    {questionImages.length === 0 && <p>Không có ảnh</p>}
                    {questionImages.map((img, i) => (
                        <div key={`q-${i}`} className={styles.imageItem}>
                            <ImagePreview filename={img} width={120}/>
                            <button
                                className={styles.addBtn}
                                onClick={() => {
                                    if (type_add === 1) {
                                        handleChange(rowIndex, -6, img);
                                    } else {
                                        if (answerIndex === undefined) return;
                                        handleChange(rowIndex, -8, {
                                            answerIndex,
                                            imagePath: img,
                                        });
                                    }
                                }
                                }
                            >
                                +
                            </button>
                        </div>
                    ))}
                </div>

                {/* ===== ANSWER IMAGES ===== */}
                {answers.map((ans, ansIndex) => (
                    <div key={ansIndex}>
                        <div className={styles.imageList}>
                            {ans.images?.map((img, imgIndex) => (
                                <div
                                    key={`a-${ansIndex}-${imgIndex}`}
                                    className={styles.imageItem}
                                >
                                    <ImagePreview filename={img} width={120}/>
                                    <button
                                        className={styles.addBtn}
                                        onClick={() => {
                                            if (type_add === 1) {
                                                // thêm cho QUESTION
                                                handleChange(rowIndex, -6, img);
                                            } else {
                                                // thêm cho ANSWER
                                                handleChange(rowIndex, -8, {
                                                    answerIndex: answerIndex,
                                                    imagePath: img,
                                                });
                                            }
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
