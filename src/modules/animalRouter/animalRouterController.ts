import { RequestValidationError } from '@/exception/request-validation-error';
import { ResponseCustom } from '@/utils/expressCustom';
import { HttpStatusCode } from '@/utils/httpStatusCode';
import { NextFunction, Request } from 'express';
import { validationResult } from 'express-validator';
import animalRouterService from './animalRouterService';

class AnimalRouterController {
  async createAnimal(req: Request, res: ResponseCustom, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    try {
      const {
        name,
        shape,
        species,
        age,
        habitat,
        diet,
        isEndangered,
        isDangerous,
        description,
      } = req.body;
      const animal = await animalRouterService.createAnimal(
        name,
        shape,
        species,
        age,
        habitat,
        diet,
        isEndangered,
        isDangerous,
        description
      );
      return res.status(HttpStatusCode.CREATED).json({
        httpStatusCode: HttpStatusCode.CREATED,
        data: animal,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async deleteAnimal(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const { id } = req.params;
      await animalRouterService.deleteAnimal(id);
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: `Delete Animal  success`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getAllAnimal(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const animal = await animalRouterService.getAllAnimal();
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: animal,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
export default new AnimalRouterController();
