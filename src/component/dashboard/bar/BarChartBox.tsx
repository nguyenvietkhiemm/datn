'use client';

import React, { useMemo } from 'react';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from "./BarChartBox.module.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

interface Props {
    title: string;
    datasets: any;
}

function BarChartBox({ title, datasets }: Props) {

    const options = useMemo(() => ({
        responsive: true,
        plugins: {
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#fff',
                bodyColor: '#e5e7eb',
                borderColor: '#9ca3af',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 6,
                titleFont: {
                    size: 14,
                    weight: 10,
                },
                bodyFont: {
                    size: 12,
                },
            },
            legend: { display: false },
            title: { display: false },
            datalabels: {
                anchor: 'end' as const,
                align: 'end' as const,
                formatter: (value: any) => `${value}`,
                color: '#000',
                font: { weight: 10 }
            }
        },
        scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true }
        }
    }), []);

    const dataWithColors = useMemo(() => {
        if (!datasets) return datasets;

        return {
            ...datasets,
            datasets: datasets.datasets.map((ds: any) => ({
                ...ds,
                backgroundColor: ds.backgroundColor || 'rgba(54, 162, 235, 0.6)',
                borderColor: ds.borderColor || 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            })),
        };
    }, [datasets]);

    return (
        <div className={styles.chartBox}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
            </div>
            <Bar data={dataWithColors} options={options} plugins={[ChartDataLabels]} />
        </div>
    );
}

export default React.memo(BarChartBox);
