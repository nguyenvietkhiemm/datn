export type UserStats = {
    date: string;
    activeUsers: number;
    userRatio: number;
    avgSession: number;
    medianSession: number;
};

export type DashboardResponse = {
    overview: {
        users: { total: number; change: string };
        submits: { total: number; change: string };
        score: { total: number; change: string };
        standard_score: { total: number; change: string };
        popular_subject: { name: string; total: number };
        users_new: { total: number; change: string };
    };
};

export type BarChartData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
};

export type LineItem = { date: string; value: number };
