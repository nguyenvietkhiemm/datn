import { Router } from 'express';

// routes
import RoleRouter from './role.route';
import UserRouter from './user.route';
import AuthRouter from './auth.route';
import QuestionRouter from './question.route';

const router = Router();

router.use('/roles', RoleRouter);
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/questions', QuestionRouter);

export default router;
