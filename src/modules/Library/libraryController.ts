import { ResponseCustom } from '@/utils/expressCustom';
import { HttpStatusCode } from '@/utils/httpStatusCode';
import { NextFunction, Request } from 'express';
import libraryService from './libraryService';
class LibraryController {
  async getAllLibrary(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const libraries = await libraryService.getAllLibrary();
      return res.status(HttpStatusCode.OK).json({
        success: true,
        data: libraries,
        message: 'Get all library success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async createLibrary(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const library = await libraryService.createLibrary(req.body);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        data: library,
        message: 'Create library success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async updateLibrary(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const library = await libraryService.updateLibrary(id, data);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        data: library,
        message: 'Update library success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async deleteLibrary(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const { id } = req.params;
      await libraryService.deleteLibrary(id);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        message: 'Delete library success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getLibraryById(req: Request, res: ResponseCustom, next: NextFunction) {
    try {
      const { id } = req.params;
      const library = await libraryService.getLibraryById(id);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        data: library,
        message: 'Get library by id success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getLibraryByType(
    req: Request,
    res: ResponseCustom,
    next: NextFunction
  ) {
    try {
      const { type } = req.params;
      const libraries = await libraryService.getLibraryByType(type);
      return res.status(HttpStatusCode.OK).json({
        success: true,
        data: libraries,
        message: 'Get library by type success',
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
export default new LibraryController();
