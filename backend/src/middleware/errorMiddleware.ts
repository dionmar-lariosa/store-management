import { NextFunction, Request, Response } from "express";
import Constant from "../constants.js";
import { DatabaseError } from "pg";
import { AppError } from "../errors/AppError.js";

const ErrorMiddleware = {
  notFoundHandler: (req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({
      error: Constant.ERROR_MESSAGES.STATUS_404
    });
  },

  errorHandler: (err: Error, req: Request, res: Response, _next: NextFunction) => {
    // Return to Client
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: {
          name: err.name,
          msg: err.message,
          cause: err.cause
        }
      });
    }

    /* 
    Ensure sensitive Errors dont logs to client
    Will save this logs to database
    */

    // Logs to Server 
    req.log.error(
      {
        res: {
          name: err.name,
          msg: err.message,
          cause: err.cause
        },
        postgres: err instanceof DatabaseError ? err : undefined
      },
      "Unhandled exception"
    );

    // Default Return to client
    return res.status(500).json({
      error: Constant.ERROR_MESSAGES.STATUS_500
    });
  }
};

export default ErrorMiddleware;
