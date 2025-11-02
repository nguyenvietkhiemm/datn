'use client';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import styles from "./BarChartBox.module.css"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
    title: string;
    datasets: any
}

export default function BarChartBox({ title, datasets }: Props) {

    const [selectedExam, setSelectedExam] = useState<'Đợt 1' | 'Đợt 2' | 'Đợt 3'>('Đợt 1');

    const data = {
        labels: ['Toán', 'Văn', 'Anh', 'Lý', 'Hóa', 'Sinh', 'Sử', 'Địa'],
        datasets: [
            {
                label: `Điểm trung bình - ${selectedExam}`,
                data: datasets[selectedExam],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

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
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
            </div>
            <div className={styles.schedules}>
                <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value as any)}
                    className={styles.select}
                >
                    <option value="Đợt 1">Đợt 1</option>
                    <option value="Đợt 2">Đợt 2</option>
                    <option value="Đợt 3">Đợt 3</option>
                </select>
            </div>
            <Bar data={data} options={options} />
        </div>
    );
}
