import { Router } from 'express';

// routes
import roleRouter from './role.route';
import userRouter from './user.route';
import authRouter from './auth.route';
import questionRouter from './question.route';
import documentRoute from './document.route';
import subjectRoute from './subject.route';
import flashcardRouter from './flashcard.route';
import topicRouter from './topic.route';

const router = Router();

router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/questions', questionRouter);
router.use('/documents', documentRoute);
router.use('/subjects', subjectRoute);
router.use("/flashcards", flashcardRouter);
router.use("/topics", topicRouter);
router.use("/", authRouter);

export default router;
