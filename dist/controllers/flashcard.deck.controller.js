"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardDeckController = void 0;
const flashcard_deck_service_1 = require("../services/flashcard.deck.service");
const safe_execute_1 = __importDefault(require("../utils/safe.execute"));
//flashcard_deck controller
exports.FlashcardDeckController = {
    getAll: async (req, res) => {
        const result = await (0, safe_execute_1.default)(async () => {
            const data = await flashcard_deck_service_1.FlashcardDeckService.getAll(req.query);
            return { status: 200, data, message: "List flashcard-deck" };
        });
        return res.status(result.status).json(result);
    },
    getById: async (req, res) => {
        const result = await (0, safe_execute_1.default)(async () => {
            const card = await flashcard_deck_service_1.FlashcardDeckService.getById(Number(req.params.id));
            if (!card) {
                return { status: 404, message: "Flashcard not found" };
            }
            return { status: 200, data: card, message: "Flashcard information" };
        });
        return res.status(result.status).json(result);
    },
    create: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const result = await (0, safe_execute_1.default)(async () => {
            const newDeck = await flashcard_deck_service_1.FlashcardDeckService.create({
                ...req.body,
                user_id: req.user.user_id
            });
            return {
                status: 201,
                data: newDeck,
                message: "Create flashcard_deck successfully",
            };
        });
        return res.status(result.status).json(result);
    },
    update: async (req, res) => {
        const result = await (0, safe_execute_1.default)(async () => {
            const updated = await flashcard_deck_service_1.FlashcardDeckService.update(Number(req.params.id), req.body);
            if (!updated) {
                return { status: 404, message: "Deck not found" };
            }
            return { status: 202, data: updated };
        });
        return res.status(result.status).json(result);
    },
    delete: async (req, res) => {
        const result = await (0, safe_execute_1.default)(async () => {
            const ok = await flashcard_deck_service_1.FlashcardDeckService.delete(Number(req.params.id));
            if (!ok) {
                return { status: 404, message: "Deck not found" };
            }
            return { status: 204, message: "Deleted successfully" };
        });
        return res.status(result.status).json(result);
    },
};
