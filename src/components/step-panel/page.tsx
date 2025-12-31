import styles from "./StepPanel.module.css";
import { SubStep } from "../../../domain/roadmap/type";

interface SubStepPanelProps {
  subStep: SubStep;
}

export default function SubStepPanel({ subStep }: SubStepPanelProps) {
  return (
    <div >
      <h5>{subStep.title}</h5>
      <p>{subStep.content}</p>

      {/* ===== RESOURCES ===== */}
      {subStep?.resources && subStep.resources?.length > 0 && (
        <div className={styles.resourceList}>
          {subStep.resources.map((res) => (
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

              <span className={styles.resourceText}>{res.title}</span>

              <span
                className={`${styles.resourceBadge} ${
                  res.access === "pro"
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
  );
}
