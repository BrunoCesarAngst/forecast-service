import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForcastController } from './controllers/forcast';
import { Application } from 'express';
import * as database from '@src/database'

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.SetupControllers();
    await this.databaseSetup()
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private SetupControllers(): void {
    const forcastController = new ForcastController();

    this.addControllers([forcastController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect()
  }

  public async close(): Promise<void> {
    await database.close()
  }

  public getApp(): Application {
    return this.app;
  }
}
