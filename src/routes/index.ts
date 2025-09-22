import { Router } from 'express';

// routes
import roleRouter from './role.route';
import questionRouter from './question.route';
import documentRoute from './document.route';
import subjectRoute from './subject.route';


const router = Router();


router.use('/roles', roleRouter);
router.use('/questions', questionRouter);
router.use('/documents', documentRoute);
router.use('/subjects', subjectRoute);

export default router;