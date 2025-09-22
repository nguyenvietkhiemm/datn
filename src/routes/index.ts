import { Router } from 'express';

// routes
import roleRouter from './role.route';
import questionRouter from './question.route';
import documentRoute from './document.route';


const router = Router();


router.use('/roles', roleRouter);
router.use('/questions', questionRouter);
router.use('/documents', documentRoute);

export default router;