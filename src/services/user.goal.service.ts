import { query } from "../config/database"
import { UserGoal } from "../model/user.goal.models"

export const UserGoalService = {
    async getAll(userId: number): Promise<UserGoal[]> {
        const result = await query(
            `SELECT * FROM user_goal WHERE user_id = $1 ORDER BY user_goal_id DESC`,
            [userId]
        );
        return result.rows;
    },

    async create(goal: UserGoal): Promise<UserGoal> {
        const result = await query(
            `INSERT INTO user_goal (target_score, deadline, user_id, subject_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [goal.target_score, goal.deadline, goal.user_id, goal.subject_id]
        );

        return result.rows[0];
    },

    async delete(id: number, userId: number): Promise<boolean> {
        await query(
            `DELETE FROM user_goal WHERE user_goal_id = $1 AND user_id = $2`,
            [id, userId]
        );
        return true;
    }
};
