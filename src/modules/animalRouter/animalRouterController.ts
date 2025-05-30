import { HttpStatusCode } from '@/utils/httpStatusCode';
import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';
dotenv.config();

class AnimalRouterController {
  async getAnimal(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 30 + (page - 1) * 20;
      const response = await axios.get('https://api.thedogapi.com/v1/breeds');
      const dogBreeds = response.data.map((breed: any) => ({
        id: breed.id,
        name: breed.name,
        image: breed.reference_image_id
          ? `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`
          : null,
        origin: breed.origin || '',
        temperament: breed.temperament || '',
        life_span: breed.life_span || '',
        weight: breed.weight,
        height: breed.height,
      }));
      const paginatedBreeds = dogBreeds.slice(0, limit);
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: paginatedBreeds,
        pagination: {
          page,
          limit,
          total: dogBreeds.length,
          totalPages: Math.ceil(dogBreeds.length / 20),
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getAnimalByImg(req: Request, res: Response, next: NextFunction) {
    try {
      const image = req.file;
      if (!image || !fs.existsSync(image.path)) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          httpStatusCode: HttpStatusCode.BAD_REQUEST,
          message: 'No image file provided or file not found',
        });
      }
      const form = new FormData();
      const filePath = path.resolve(image.path);
      form.append('file', fs.createReadStream(filePath), {
        filename: image.originalname,
        contentType: image.mimetype,
      });

      const response = await axios.post(
        'https://api.thedogapi.com/v1/images/upload',
        form,
        {
          headers: {
            ...form.getHeaders(),
            'x-api-key': process.env.API_KEY_THEDOG,
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );
      fs.unlinkSync(image.path);
      const image_id = response.data.id;
      const breedRes = await axios.get(
        `https://api.thedogapi.com/v1/images/${image_id}`,
        {
          headers: { 'x-api-key': process.env.API_KEY_THEDOG },
        }
      );
      const dataAnimal = breedRes.data;
      console.log(dataAnimal);
      return res.status(HttpStatusCode.OK).json({
        httpStatusCode: HttpStatusCode.OK,
        data: {
          breed: dataAnimal.breeds?.[0] || null,
          image: dataAnimal.url,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
export default new AnimalRouterController();
