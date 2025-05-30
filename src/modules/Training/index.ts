import { Router } from 'express';
import trainingController from './trainingController';
const TrainingRouter = Router();
TrainingRouter.get('/all', trainingController.getAllTraining);
TrainingRouter.post('/create', trainingController.createTraining);
TrainingRouter.put('/update/:id', trainingController.updateTraining);
TrainingRouter.delete('/delete/:id', trainingController.deleteTraining);
export default TrainingRouter;
