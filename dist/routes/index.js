"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// routes
const role_route_1 = __importDefault(require("./role.route"));
const user_route_1 = __importDefault(require("./user.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const question_route_1 = __importDefault(require("./question.route"));
const document_route_1 = __importDefault(require("./document.route"));
const subject_route_1 = __importDefault(require("./subject.route"));
const flashcard_route_1 = __importDefault(require("./flashcard.route"));
const topic_route_1 = __importDefault(require("./topic.route"));
const router = (0, express_1.Router)();
router.use('/roles', role_route_1.default);
router.use('/users', user_route_1.default);
router.use('/auth', auth_route_1.default);
router.use('/questions', question_route_1.default);
router.use('/documents', document_route_1.default);
router.use('/subjects', subject_route_1.default);
router.use("/flashcards", flashcard_route_1.default);
router.use("/topics", topic_route_1.default);
router.use("/", auth_route_1.default);
exports.default = router;
