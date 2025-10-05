"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
const safe_execute_1 = __importDefault(require("../utils/safe.execute"));
const AuthController = {
    async register(req, res) {
        const { user_name, password, email, birthday } = req.body;
        const response = await (0, safe_execute_1.default)(async () => {
            const result = await auth_service_1.default.register(user_name, password, email, new Date(birthday));
            return { status: 201, message: "Đăng ký thành công", data: result };
        });
        if (response.error === "EMAIL_EXISTS") {
            response.status = 400;
            response.message = "Email đã tồn tại. Vui lòng chọn email khác!";
            delete response.error;
        }
        return res.status(response.status).json(response);
    },
    async login(req, res) {
        const { email, password } = req.body;
        const response = await (0, safe_execute_1.default)(async () => {
            const result = await auth_service_1.default.login(email, password);
            return { status: 200, message: "Đăng nhập thành công", data: result };
        });
        // map lỗi từ service
        if (response.error === "USER_NOT_FOUND") {
            response.status = 404;
            response.message = "Không tìm thấy người dùng";
            delete response.error;
        }
        else if (response.error === "INVALID_PASSWORD") {
            response.status = 401;
            response.message = "Mật khẩu không đúng";
            delete response.error;
        }
        return res.status(response.status).json(response);
    },
};
exports.default = AuthController;
