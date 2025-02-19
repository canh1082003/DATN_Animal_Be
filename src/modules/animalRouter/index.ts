import { Router } from 'express';
import animalRouterController from './animalRouterController';
import { AnimalMiddleware } from '@/middlewares/animal.middlewares';

export const AnimalRouter = Router();
AnimalRouter.post(
  '/createAnimal',
  AnimalMiddleware,
  animalRouterController.createAnimal
);
AnimalRouter.delete('/deleteAnimal/:id', animalRouterController.deleteAnimal);
AnimalRouter.get('/all', animalRouterController.getAllAnimal);
