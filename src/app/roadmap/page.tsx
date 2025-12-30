"use client";
import { useState } from "react";
import styles from "./RoadMap.module.css";
import { ROADMAPS, SubStep } from "../../../domain/roadmap/type";

export default function RoadmapUI() {
  const [openSubStep, setOpenSubStep] = useState<number | null>(null);

  const [panelData, setPanelData] = useState<{
    type: "step" | "subStep";
    data: any;
  } | null>(null);

  return (
    <div className={styles.roadmapWrapper}>
      <div className={styles.roadmapList}>
        {ROADMAPS.map((roadmap) => (
          <div key={roadmap.roadmap_id} className={styles.roadmapCard}>
            <h2 className={styles.roadmapTitle}>{roadmap.title}</h2>
            <p className={styles.roadmapDescription}>
              {roadmap.description}
            </p>
            {roadmap.steps.map((step) => (
              <div key={step.roadmap_step_id} className={styles.stepBlock}>
                {/* STEP – chỉ hiển thị, không set panel */}
                <h3
                  className={styles.stepTitle}
                  onClick={() => {
                    setOpenSubStep(null);
                    setPanelData({
                      type: "step",
                      data: step,
                    });
                  }}
                >
                  {step.title}
                </h3>
                <p className={styles.stepDescription}>
                  {step.description}
                </p>
                {/* SUB STEPS */}
                {step.subSteps.map((sub) => {
                  const isOpen = openSubStep === sub.sub_step_id;
                  return (
                    <div
                      key={sub.sub_step_id}
                      className={styles.subStepItem}
                    >
                      <button
                        className={styles.subStepButton}
                        onClick={() => {
                          const isOpen = openSubStep === sub.sub_step_id;

                          setOpenSubStep(isOpen ? null : sub.sub_step_id);
                          setPanelData(
                            isOpen
                              ? null
                              : {
                                type: "subStep",
                                data: sub,
                              }
                          );
                        }}
                      >
                        {sub.title}
                        <span
                          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""
                            }`}
                        >
                          ▶
                        </span>
                      </button>
                      {isOpen && (
                        <div className={styles.subStepContent}>
                          {sub.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* SIDE PANEL */}
      {panelData && (
        <div className={styles.panelSubStep}>
          {/* STEP MODE */}
          {panelData.type === "step" && (
            <>
              <h4>{panelData.data.title}</h4>
              <p>{panelData.data.description}</p>

              {panelData.data.subSteps.map((sub: any) => (
                <div key={sub.sub_step_id} className={styles.panelSubItem}>
                  <h5>{sub.title}</h5>
                  <p>{sub.content}</p>

                  {/* ===== RESOURCES ===== */}
                  {sub.resources?.length > 0 && (
                    <div className={styles.resourceList}>
                      {sub.resources.map((res: any) => (
                        <a
                          key={res.title}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.resourceItem}
                        >
                          <span className={styles.resourceIcon}>
                            {res.type === "article" && "📘"}
                            {res.type === "video" && "🎥"}
                            {res.type === "quiz" && "❓"}
                            {res.type === "pdf" && "📄"}
                            {res.type === "external" && "🔗"}
                          </span>

                          <span className={styles.resourceText}>
                            {res.title}
                          </span>

                          <span
                            className={`${styles.resourceBadge} ${res.access === "pro"
                                ? styles.badgePro
                                : styles.badgeFree
                              }`}
                          >
                            {res.access.toUpperCase()}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/*  SUB STEP MODE  */}
          {panelData.type === "subStep" && (
            <>
              <h4>{panelData.data.title}</h4>
              <p>{panelData.data.content}</p>

              {panelData.data.resources?.length > 0 && (
                <div className={styles.resourceList}>
                  {panelData.data.resources.map((res: any) => (
                    <a
                      key={res.title}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.resourceItem}
                    >
                      <span className={styles.resourceIcon}>
                        {res.type === "article" && "📘"}
                        {res.type === "video" && "🎥"}
                        {res.type === "quiz" && "❓"}
                        {res.type === "pdf" && "📄"}
                        {res.type === "external" && "🔗"}
                      </span>

                      <span className={styles.resourceText}>
                        {res.title}
                      </span>

                      <span
                        className={`${styles.resourceBadge} ${res.access === "pro"
                          ? styles.badgePro
                          : styles.badgeFree
                          }`}
                      >
                        {res.access.toUpperCase()}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
