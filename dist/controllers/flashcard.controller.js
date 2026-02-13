"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardController = void 0;
const flashcard_service_1 = require("../services/flashcard.service");
const safe_execute_1 = __importDefault(require("../utils/safe.execute"));
//flashcard controller
exports.FlashcardController = {
    add: async (req, res) => {
        const result = await (0, safe_execute_1.default)(async () => {
            const newCard = await flashcard_service_1.FlashcardService.add({
                ...req.body,
                flashcard_deck_id: Number(req.params.id),
            });
            return { status: 201, data: newCard, message: "Flashcard create successfully" };
        });
        return res.status(result.status).json(result);
    },
    update: async (req, res) => {
        const result = await (0, safe_execute_1.default)(async () => {
            const updated = await flashcard_service_1.FlashcardService.update(Number(req.params.id), req.body);
            if (!updated) {
                return { status: 404, message: "Flashcard not found" };
            }
            return { status: 202, data: updated, message: "Flashcard update" };
        });
        return res.status(result.status).json(result);
    },
    delete: async (req, res) => {
        const result = await (0, safe_execute_1.default)(async () => {
            const ok = await flashcard_service_1.FlashcardService.delete(Number(req.params.id));
            if (!ok) {
                return { status: 404, message: "Flashcard not found" };
            }
            return { status: 204, message: "Deleted successfully" };
        });
        return res.status(result.status).json(result);
    },
};
