"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = exports.specs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000/", // đúng với server.ts
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/server.ts"],
};
const swaggerOptions = {
    swaggerOptions: {
        persistAuthorization: true,
        responseInterceptor: (res) => {
            if (res.url.endsWith("/auth/login") && res.status === 200) {
                try {
                    const data = JSON.parse(res.text);
                    const token = data?.data?.token; // 🔥 token đúng chỗ
                    if (token) {
                        console.log("Token nhận được:", token);
                        window.ui?.preauthorizeApiKey("bearerAuth", token);
                    }
                }
                catch (e) {
                    console.error("Không parse được token", e);
                }
            }
            return res;
        },
    },
};
exports.swaggerOptions = swaggerOptions;
const specs = (0, swagger_jsdoc_1.default)(options);
exports.specs = specs;
