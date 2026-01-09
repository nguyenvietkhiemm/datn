import styles from "./Card.module.css";
import { Info } from "lucide-react"; 
import React from "react";

interface CardProps {
  title: string;
  value: string;
  change?: string;
  tooltip?: string;
}

function Card({ title, value, change, tooltip }: CardProps) {
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>
        {title}
        {tooltip && (
          <span className={styles.tooltipWrapper}>
            <Info size={16} className={styles.infoIcon} />
            <span className={styles.tooltipText}>{tooltip}</span>
          </span>
        )}
      </h4>

      <div className={styles.value}>{value}</div>
      <div
        className={`${styles.change} ${change?.includes("-") ? styles.negative : styles.positive
          }`}
      >
        {change}
      </div>
    </div>
  );
}

export default React.memo(Card);
