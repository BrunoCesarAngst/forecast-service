import { CUSTOM_VALIDATION } from '@src/models/user';
import { Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientError = this.handleClienteError(error);
      res
        .status(clientError.code)
        .send({ code: clientError.code, error: clientError.error });
    } else {
      res.status(500).send({ code: 500, error: 'Something want wrong!' });
    }
  }

  private handleClienteError(
    error: mongoose.Error.ValidationError
  ): { code: number; error: string } {
    const duplicatedKindError = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );
    if (duplicatedKindError.length) {
      return { code: 409, error: error.message };
    }
    return { code: 422, error: error.message };
  }
}
