import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForcastController } from './controllers/forcast';
import { Application } from 'express';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.SetupControllers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private SetupControllers(): void {
    const forcastController = new ForcastController();

    this.addControllers([forcastController]);
  }

  public getApp(): Application {
    return this.app;
  }
}
