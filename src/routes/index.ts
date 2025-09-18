import { Router } from 'express';

// routes
import roleRouter from './role.route';

const router = Router();


router.use('/roles', roleRouter);


export default router;