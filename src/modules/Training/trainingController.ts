import { ResponseCustom } from '@/utils/expressCustom';
import { HttpStatusCode } from '@/utils/httpStatusCode';
import { NextFunction, Request } from 'express';
import trainingService from './trainingService';
import { validationResult } from 'express-validator';
import BadRequestException from '@/common/exception/BadRequestException';
class trainingController {
  async getAllTraining(req: Request, res: ResponseCustom, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }
    try {
      const trainings = await trainingService.getAllTraining();
      return res.status(HttpStatusCode.OK).json({
        success: true,
        data: trainings,
        message: 'Get all training success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async createTraining(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const data = req.body;
      const training = await trainingService.createTraining(data);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        data: training,
        message: 'Create training success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async updateTraining(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const training = await trainingService.updateTraining(id, data);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        data: training,
        message: 'Update training success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async deleteTraining(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const { id } = req.params;
      await trainingService.deleteTraining(id);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: 'Delete training success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
export default new trainingController();
