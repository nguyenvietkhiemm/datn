import { Router } from "express";
import  Authentication  from "../middleware/authentication"
import MicroserviceController from "../controllers/microservice.controller";

const microserviceRoute = Router();

/**
 * @openapi
 * /microservice/llm/ask:
 *   post:
 *     summary: Hỏi LLM RAG
 *     tags:
 *       - LLM
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *            
 *             properties:
 *               question:
 *                 type: string
 *                 example: "Trong điều kiện chuẩn về nhiệt độ và áp suất thì"
 *     responses:
 *       200:
 *         description: Trả về câu trả lời từ LLM
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     answer:
 *                       type: string
 *                     sources:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           file_name:
 *                             type: string
 *                           file_path:
 *                             type: string
 *                           score:
 *                             type: number
 *                           preview:
 *                             type: string
 *       400:
 *         description: Request không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */

microserviceRoute.post(
    "/llm/ask",
    Authentication.AuthenticateToken,
    MicroserviceController.askLLM
);


export default microserviceRoute;