// src/routes/flashcard.route.ts
import { Router } from "express";
import { FlashcardController } from "../controllers/flashcard.controller";
import { FlashcardDeckController } from "../controllers/flashcard.deck.controller";
import Authentication from '../middleware/authentication';
import { ADMIN } from "../config/permission";

const flashcardRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Flashcards
 *     description: Flashcard API
 */

// DECK ROUTE

/**
 * @swagger
 * /flashcards/decks:
 *   get:
 *     summary: Get all flashcard decks with pagination (yêu cầu đăng nhập)
 *     tags: [Flashcards]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of decks with pagination
 */
flashcardRouter.get("/decks", 
        Authentication.AuthenticateToken,
        FlashcardDeckController.getAll);

/**
 * @swagger
 * /flashcards/decks/{id}:
 *   get:
 *     summary: Get flashcard deck by ID (yêu cầu đăng nhập)
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flashcard deck data
 *       404:
 *         description: Deck not found
 */
flashcardRouter.get("/decks/:id",
        Authentication.AuthenticateToken,
        FlashcardDeckController.getById);

/**
 * @swagger
 * /flashcards/decks/create:
 *   post:
 *     summary: Create a new deck (yêu cầu đăng nhập)
 *     tags: [Flashcards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sample Deck"
 *               description:
 *                 type: string
 *                 example: "This is a sample flashcard deck"
 *     responses:
 *       201:
 *         description: Deck created successfully
 */
flashcardRouter.post("/decks/create",
        Authentication.AuthenticateToken,
        FlashcardDeckController.create);

/**
 * @swagger
 * /flashcards/decks/add/{id}:
 *   post:
 *     summary: Thêm flashcard mới vào deck (yêu cầu đăng nhập)
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của flashcard deck
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               front:
 *                 type: string
 *                 example: "What is 2 + 2?"
 *               back:
 *                 type: string
 *                 example: "4"
 *               example:
 *                 type: string
 *                 example: "Basic math"
 *     responses:
 *       201:
 *         description: Flashcard được thêm thành công
 *       401:
 *         description: Thiếu hoặc sai token
 *       404:
 *         description: Không tìm thấy deck
 */
flashcardRouter.post("/decks/add/:id",
        Authentication.AuthenticateToken,
        FlashcardController.add);

/**
 * @swagger
 * /flashcards/decks/update/{id}:
 *   put:
 *     summary: Update a flashcard deck (yêu cầu đăng nhập)
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Sample Deck updated"
 *               description:
 *                 type: string
 *                 example: "This is a sample flashcard deck updated"
 *     responses:
 *       200:
 *         description: Deck updated successfully
 *       404:
 *         description: Deck not found
 */
flashcardRouter.put("/decks/update/:id",
        Authentication.AuthenticateToken,
        FlashcardDeckController.update);

/**
 * @swagger
 * /flashcards/decks/delete/{id}:
 *   delete:
 *     summary: Delete a flashcard deck (yêu cầu đăng nhập)
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deck deleted successfully
 *       404:
 *         description: Deck not found
 */
flashcardRouter.delete("/decks/remove/:id",
        Authentication.AuthenticateToken,
        FlashcardDeckController.remove);

// FLASHCARD ROUTE

/**
 * @swagger
 * /flashcards/update/{id}:
 *   put:
 *     summary: Update a flashcard (yêu cầu đăng nhập)
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               front:
 *                 type: string
 *               back:
 *                 type: string
 *               example:
 *                 type: string
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *       404:
 *         description: Flashcard not found
 */
flashcardRouter.put("/update/:id",
        Authentication.AuthenticateToken,
        FlashcardController.update);

/**
 * @swagger
 * /flashcards/delete/{id}:
 *   delete:
 *     summary: Delete a flashcard (yêu cầu đăng nhập)
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flashcard deleted successfully
 *       404:
 *         description: Flashcard not found
 */
flashcardRouter.delete("/remove/:id",
        Authentication.AuthenticateToken,
        FlashcardController.remove);

export default flashcardRouter;
