import { Router } from 'express';
import animalRouterController from './animalRouterController';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const AnimalRouter = Router();
AnimalRouter.get('/', animalRouterController.getAnimal);
AnimalRouter.post(
  '/getAnimalByImg',
  upload.single('image'),
  animalRouterController.getAnimalByImg
);
export default AnimalRouter;
