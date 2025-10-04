"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = safeExecute;
async function safeExecute(fn) {
    try {
        const { status, data, message } = await fn();
        return {
            status,
            data,
            message
        };
    }
    catch (error) {
        console.error("safeExecute error:", error);
        return {
            status: 500,
            message: "Lỗi thực thi hàm",
            error: error.message,
        };
    }
}
