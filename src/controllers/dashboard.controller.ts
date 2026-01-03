import { Request, Response } from "express";
import { DashBoardService } from "../services/dashboard.service";
import { DefaultResponse } from "../utils/safe.execute";
import safeExecute from "../utils/safe.execute";

export const DashboardController = {
    async getDashboardStats (req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            const { year, month } = req.query;
    
            if (!year || !month) {
                return {
                    status: 400,
                    message: "Thiếu year hoặc month",
                    data: null,
                };
            }
    
            const data = await DashBoardService.getDashboardStats({
                year: Number(year),
                month: Number(month),
            });
    
            return {
                status: 200,
                message: "Lấy dữ liệu dashboard thành công",
                data,
            };
        });
    
        return res.status(result.status).json(result);
    }
}
