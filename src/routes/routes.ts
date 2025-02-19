import { AnimalRouter } from '@/modules/animalRouter';
import { UserRouter } from '@/modules/userRouter';
import { Router } from 'express';
const router = Router();

router.use('/user', UserRouter);
router.use('/animal', AnimalRouter);
export default router;
