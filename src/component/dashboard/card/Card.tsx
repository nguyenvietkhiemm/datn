import styles from "./Card.module.css"

interface CardProps {
  title: string;
  value: string;
  change: string;
}

export default function Card({ title, value, change } : CardProps) {
  return (
    <div className={styles.card}>
      <h4>{title}</h4>
      <div className={styles.value}>{value}</div>
      <div
        className={`${styles.change} ${
          change.includes("-") ? styles.negative : styles.positive
        }`}
      >
        {change}
      </div>
    </div>
  );
}
