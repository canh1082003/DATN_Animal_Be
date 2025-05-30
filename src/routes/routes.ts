import { Router } from 'express';
import { UserRouter } from '@/modules/User';
import userRouterController from '@/modules/User/userController';

import chatRouter from '@/modules/Chat';
import PetRouter from '@/modules/Pet';
import verifyTokenMiddleware from '@/middlewares/chat.middlewares';
import AnimalRouter from '@/modules/animalRouter';
import LibraryRouter from '@/modules/Library';
import TrainingRouter from '@/modules/Training';

const router = Router();

// Public routes
router.post('/auth/register', userRouterController.Register);
router.post('/auth/login', userRouterController.Login);

// Protected routes
router.use('/user', UserRouter);
router.use('/animal', AnimalRouter);
router.use('/pet', verifyTokenMiddleware, PetRouter);
router.use('/chat', chatRouter);
router.use('/library', LibraryRouter);
router.use('/training', TrainingRouter);

export default router;
