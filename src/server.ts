import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForcastController } from './controllers/forcast';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import { Application } from 'express';
import * as database from '@src/database';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';
import logger from './logger';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.SetupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino({
      logger
    }));
    this.app.use(cors({
      origin: '*',
    }));
  }

  private SetupControllers(): void {
    const forcastController = new ForcastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();

    this.addControllers([
      forcastController,
      beachesController,
      usersController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening of port ' + this.port);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}
