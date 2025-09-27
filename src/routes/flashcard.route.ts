// src/routes/flashcard.route.ts
import { Router } from "express";
import { FlashcardController } from "../controllers/flashcard.controller";

const flashcardRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Flashcards
 *     description: Flashcard API
 */

/**
 * @swagger
 * /flashcards/create:
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
 *               flashcard_deck_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Flashcard created successfully
 */
flashcardRoute.post("/create", FlashcardController.create);

/**
 * @swagger
 * /flashcards/update/{id}:
 *   put:
 *     summary: Update a flashcard
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
flashcardRoute.put("/update/:id", FlashcardController.update);

/**
 * @swagger
 * /flashcards/delete/{id}:
 *   delete:
 *     summary: Delete a flashcard
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
flashcardRoute.delete("/delete/:id", FlashcardController.delete);

export default flashcardRoute;
