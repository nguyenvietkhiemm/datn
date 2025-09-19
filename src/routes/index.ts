import { Router } from 'express';

// routes
import roleRouter from './role.route';
import questionRouter from './question.route';

const router = Router();


router.use('/roles', roleRouter);
router.use('/question', questionRouter);

export default router;