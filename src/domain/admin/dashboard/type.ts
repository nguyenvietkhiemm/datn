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

    charts?: {
        line: { date: string; value: number }[];
        dau: any;
        wau: any;
        mau: any;
        pieScoreBySubject: any;
        pieMostTaken: any;
        pieMostCompleted: any;
        table: UserStats[];
    };
};
