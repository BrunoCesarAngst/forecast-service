import { Controller, Get } from '@overnightjs/core';
import { Beach } from '@src/models/beach';
import { Forecast } from '@src/services/forecast';
import { Request, Response } from 'express';

const forecast = new Forecast();

@Controller('forecast')
export class ForcastController {
  @Get('')
  public async getForcastForLoggedUser(
    _: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forcastData = await forecast.processForcastForBeaches(beaches);
      res.status(200).send(forcastData);
    } catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
}
