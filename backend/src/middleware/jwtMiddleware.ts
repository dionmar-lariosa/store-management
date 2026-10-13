import { NextFunction, Request, Response } from "express";
import JwtUtil from "../utils/jwtUtil.js";

const JwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const token = authorization.replace("Bearer ", "");
    JwtUtil.verifyToken(token);

    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }
};

export default JwtMiddleware;
