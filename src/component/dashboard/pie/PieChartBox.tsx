'use client';
import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import styles from './PieChartBox.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieProp {
  title: string;
  pieDataBySubject: { [key: string]: number[] };
  labels: string[];
}

export default function PieChartBox({ title, pieDataBySubject, labels }: PieProp) {
  const [selectedSubject, setSelectedSubject] = useState(Object.keys(pieDataBySubject)[0]);

  const chartData = {
    labels,
    datasets: [
      {
        data: pieDataBySubject[selectedSubject],
        backgroundColor: ['#27ae60', '#3498db', '#f1c40f', '#e74c3c'],
      },
    ],
  };

  return (
    <div className={styles.chartBox}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className={styles.select}
        >
          {Object.keys(pieDataBySubject).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>
      <Pie data={chartData} />
    </div>
  );
}
