'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import styles from "./LineChartBox.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
  title: string;
  data: any;
}

export default function LineChartBox({ title, data }: Props) {
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
    },
  };

  return (
    <div className={styles.chartBox}>
      <h3 className={styles.title}>{title}</h3>
      <Line data={data} options={options} className={styles.line}/>
    </div>
  );
}
