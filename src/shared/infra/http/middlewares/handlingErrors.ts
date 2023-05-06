import { NextFunction, Request, Response } from 'express';
import { AppError } from '@errors/appError';

export function handlingErrors(
  err: Error,
  _request: Request,
  response: Response,
  next: NextFunction
) {
  if (err) {
    if (err instanceof AppError) {
      return response.status(err.code).json({
        message: err.message,
        type: err.type,
      });
    }

    const data = {
      errorStack: err.stack,
      message: `Internal server error: \n${err.message}`,
    };

    return response.status(500).json(data);
  }

  next();
}
