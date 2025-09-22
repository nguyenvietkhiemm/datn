import { Router } from 'express';

// routes
import RoleRouter from './role.route';
import UserRouter from './user.route';
import AuthRouter from './auth.route';
import QuestionRouter from './question.route';
import DocumentRoute from './document.route';
import SubjectRoute from './subject.route';
import FlashcardRoute from './flashcard.route';
import FlashcardDeckRouter from './flashcard.deck.route';

const router = Router();

router.use('/roles', RoleRouter);
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/questions', QuestionRouter);
router.use('/documents', DocumentRoute);
router.use('/subjects', SubjectRoute);
router.use("/flashcards/decks", FlashcardDeckRouter);
router.use("/flashcards", FlashcardRoute);

export default router;
