import { FlashcardDeckController } from "../controllers/flashcard.deck.controller";
import { Router } from "express";

const flashcardDeckRouter = Router();

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
 */
flashcardDeckRouter.get("/", FlashcardDeckController.getAll);

/**
 * @swagger
 * /flashcards/decks/create:
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
flashcardDeckRouter.post("/create", FlashcardDeckController.create);

/**
 * @swagger
 * /flashcards/decks/{id}:
 *   get:
 *     summary: Get flashcard deck by ID
 *     tags: [Decks]
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
flashcardDeckRouter.get("/:id", FlashcardDeckController.getById);

/**
 * @swagger
 * /flashcards/decks/update/{id}:
 *   put:
 *     summary: Update a flashcard deck
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
 */
flashcardDeckRouter.put("/update/:id", FlashcardDeckController.update);

/**
 * @swagger
 * /flashcards/decks/delete/{id}:
 *   delete:
 *     summary: Delete a flashcard deck
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
flashcardDeckRouter.delete("/delete/:id", FlashcardDeckController.delete);

export default flashcardDeckRouter;
