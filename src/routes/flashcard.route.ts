// src/routes/flashcard.route.ts
import { Router } from "express";
import {
  FlashcardController,
} from "../controllers/flashcard.controller";

const flashcardRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Flashcards
 *     description: Flashcard API
 *   - name: Decks
 *     description: Flashcard Deck API
 */

/**
 * @swagger
 * /flashcards:
 *   post:
 *     summary: Create a new flashcard
 *     tags: [Flashcards]
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
 *       201:
 *         description: Flashcard created successfully
 */
flashcardRoute.post("/", FlashcardController.create);

/**
 * @swagger
 * /flashcards/{flashcard_deck_id}:
 *   get:
 *     summary: Get flashcard by flashcard_deck_id
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: flashcard_deck_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flashcard data
 *       404:
 *         description: Flashcard not found
 *   put:
 *     summary: Update flashcard
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
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *       404:
 *         description: Flashcard not found
 *   delete:
 *     summary: Delete flashcard
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
flashcardRoute.get("/:flashcard_deck_id", FlashcardController.getById);
flashcardRoute.put("/:id", FlashcardController.update);
flashcardRoute.delete("/:id", FlashcardController.delete);

export default flashcardRoute;
