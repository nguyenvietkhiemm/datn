import { FlashcardDeckController } from "../controllers/flashcard.deck.controller";
import { Router } from "express";

const FlashcardDeckRouter = Router();

/**
 * @swagger
 * /flashcards/decks:
 *   get:
 *     summary: Get all flashcard decks with pagination
 *     tags: [Decks]
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
 *   post:
 *     summary: Create a new deck
 *     tags: [Decks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               user_id:
 *                 type: number
 *     responses:
 *       201:
 *         description: Deck created successfully
 */
FlashcardDeckRouter.get("/", FlashcardDeckController.getAll);
FlashcardDeckRouter.post("/", FlashcardDeckController.create);

/**
 * @swagger
 * /flashcards/decks/{id}:
 *   put:
 *     summary: Update deck
 *     tags: [Decks]
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
 *         description: Deck updated successfully
 *       404:
 *         description: Deck not found
 *   delete:
 *     summary: Delete deck
 *     tags: [Decks]
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
FlashcardDeckRouter.put("/:id", FlashcardDeckController.update);
FlashcardDeckRouter.delete("/:id", FlashcardDeckController.delete);

export default FlashcardDeckRouter;
