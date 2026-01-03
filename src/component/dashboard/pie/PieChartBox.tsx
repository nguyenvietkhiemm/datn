'use client';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2'; 
import React from 'react';
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
  pieDataBySubject: { [key: string]: number[] | number };
  labels: string[];
}

const COLORS_13 = [
  '#27ae60', // xanh lá
  '#3498db', // xanh dương
  '#f1c40f', // vàng
  '#e74c3c', // đỏ
  '#9b59b6', // tím
  '#1abc9c', // xanh ngọc
  '#e67e22', // cam
  '#2ecc71', // xanh lá nhạt
  '#34495e', // xanh đậm
  '#d35400', // cam đậm
  '#7f8c8d', // xám
  '#16a085', // xanh teal
  '#c0392b', // đỏ đậm
];

function PieChartBox({ title, pieDataBySubject, labels }: PieProp) {
  const subjects = Object.keys(pieDataBySubject);
  const isMultiDataset = Array.isArray(pieDataBySubject[subjects[0]]);

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  // Dữ liệu biểu đồ
  const chartData = isMultiDataset
    ? {
      labels,
      datasets: [
        {
          data: pieDataBySubject[selectedSubject] as number[],
          backgroundColor: COLORS_13,
          borderWidth: 3,        
          borderColor: '#fff',   
          borderRadius: 8,
        },
      ],
    }
    : {
      labels,
      datasets: [
        {
          data: subjects.map((s) => pieDataBySubject[s] as number),
          backgroundColor: COLORS_13,
          borderWidth: 3,        
          borderColor: '#fff',   
          borderRadius: 8,
        },
      ],
    };

  // Thêm phần options để có khoảng trống giữa (donut)
  const options = {
    cutout: '60%', // tạo khoảng trống giữa 60%
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className={styles.chartBox}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {isMultiDataset && (
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={styles.select}
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Dùng Doughnut thay vì Pie và thêm options */}
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

export default React.memo(PieChartBox);
