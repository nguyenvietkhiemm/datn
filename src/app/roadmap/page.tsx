"use client";
import React, { useEffect, useState } from "react";
import styles from "./RoadMap.module.css";
import { RoadmapService } from "../../../domain/roadmap/service";
import { RoadmapStep } from "../../../domain/roadmap/type";

export default function RoadMap() {
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    RoadmapService.getAll()
      .then(res => {
        setSteps(res.data);
      })
      .catch(err => {
        console.error("Load roadmap failed", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Đang tải lộ trình...</p>;
  }

  return (
    <div className={styles.roadmapContainer}>
      <h2 className={styles.roadmapTitle}>
        Lộ Trình Ôn Thi THPT Quốc Gia
      </h2>

      <p className={styles.roadmapSubtitle}>
        Làm theo từng bước dưới đây để ôn thi hiệu quả và bền vững.
      </p>

      <div className={styles.roadmapLine}>
        {steps?.map((step, index) => (
          <div
            key={step.roadmap_step_id}
            className={styles.roadmapStep}
          >
            <div className={styles.stepCircle}>
              {index + 1}
            </div>

            <div className={styles.stepContent}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
