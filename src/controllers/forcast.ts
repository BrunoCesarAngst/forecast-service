import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForcastController {
  @Get('')
  public async getForcastForLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({ user: req.decoded?.id });
      const forcastData = await forecast.processForcastForBeaches(beaches);
      res.status(200).send(forcastData);
    } catch (error) {
      // console.error(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
}
