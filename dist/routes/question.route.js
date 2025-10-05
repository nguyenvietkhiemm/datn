"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const question_controller_1 = __importDefault(require("../controllers/question.controller"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const permission_1 = require("../config/permission");
const questionRoute = (0, express_1.Router)();
/**
 * @openapi
 * /questions:
 *   get:
 *     summary: Lấy danh sách câu hỏi [hiện tại max 100 câu]
 *     tags:
 *       - Question
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.get('/', question_controller_1.default.getAll);
/**
 * @openapi
 * /questions/create:
 *   post:
 *     summary: Tạo nhiều câu hỏi mới (Yêu cầu admin)
 *     tags:
 *       - Question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_name:
 *                       type: string
 *                       example: "Định luật II Newton"
 *                     question_content:
 *                       type: string
 *                       example: "Lực bằng khối lượng nhân gia tốc là phát biểu của định luật nào?"
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           answer_content:
 *                             type: string
 *                             example: "Định luật II Newton"
 *                           is_correct:
 *                             type: boolean
 *                             example: true
 *           example:
 *             questions:
 *               - question_name: "Định luật II Newton"
 *                 question_content: "Lực bằng khối lượng nhân gia tốc là phát biểu của định luật nào?"
 *                 answers:
 *                   - answer_content: "Định luật I Newton"
 *                     is_correct: false
 *                   - answer_content: "Định luật II Newton"
 *                     is_correct: true
 *               - question_name: "Thủ đô của Việt Nam"
 *                 question_content: "Thành phố nào là thủ đô của Việt Nam?"
 *                 answers:
 *                   - answer_content: "Hà Nội"
 *                     is_correct: true
 *                   - answer_content: "TP. Hồ Chí Minh"
 *                     is_correct: false
 *     responses:
 *       201:
 *         description: Tạo câu hỏi thành công
 *       500:
 *         description: Lỗi server
 */
questionRoute.post('/create', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), question_controller_1.default.create);
/**
 * @openapi
 * /questions/update/{id}:
 *   patch:
 *     summary: Cập nhật một phần thông tin câu hỏi và câu trả lời (Yêu cầu admin)
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của câu hỏi cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             question_name: "Định luật II Newton (bản cập nhật)"
 *             question_content: "F = m * a (cập nhật)"
 *             answers:
 *               - answer_id: 54
 *                 answer_content: "Định luật I Newton (cập nhật)"
 *                 is_correct: false
 *               - answer_id: 55
 *                 answer_content: "Định luật II Newton (cập nhật)"
 *                 is_correct: true
 *               - answer_content: "Định luật III Newton (thêm mới)"
 *                 is_correct: false
 *     responses:
 *       202:
 *         description: Cập nhật câu hỏi thành công
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.patch('/update/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), question_controller_1.default.update);
/**
 * @openapi
 * /questions/remove/{id}:
 *   delete:
 *     summary: Xóa một câu hỏi theo ID (Yêu cầu admin)
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của câu hỏi cần xóa
 *     responses:
 *       204:
 *         description: Xóa câu hỏi thành công
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.delete('/remove/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), question_controller_1.default.remove);
/**
 * @openapi
 * /questions/setAvailable/{id}:
 *   patch:
 *     summary: Thay đổi trạng thái available của câu hỏi theo ID (Yêu cầu admin)
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của câu hỏi cần thay đổi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             available: false
 *     responses:
 *       204:
 *         description: Cập nhật trạng thái thành công
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.patch('/setAvailable/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), question_controller_1.default.setAvailable);
exports.default = questionRoute;
