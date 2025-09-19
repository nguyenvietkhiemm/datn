import { Router } from 'express';
import QuestionController from '../controllers/question.controller';

const questionRoute = Router();

/**
 * @openapi
 * /roles:
 *   get:
 *     summary: Lấy danh sách question
 *     tags:
 *       - Question
 *     responses:
 *       200:
 *         description: Danh sách role
 *       500:
 *         description : loi
 */
questionRoute.get('/', QuestionController.getAll);

/**
 * @openapi
 * /questions:
 *   get:
 *     summary: Lấy danh sách câu hỏi
 *     tags:
 *       - Question
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.post('/create', QuestionController.create);


export default questionRoute;
