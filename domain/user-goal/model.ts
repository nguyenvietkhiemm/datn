export type GoalStatus = "CON_HAN" | "SAP_HET_HAN" | "HET_HAN";

export function getGoalStatusDetail(deadline: string): GoalStatus {
    const now = Date.now();
    const end = new Date(deadline).getTime();
    const diff = end - now;

    if (diff <= 0) return "HET_HAN";
    if (diff <= 24 * 60 * 60 * 1000) return "SAP_HET_HAN"; // < 24h
    return "CON_HAN";
}
