import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorMessage } from '../../domain/models/errorMessage';
import StatusCodes from '../utils/statusCodes';

export default (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization!.split(' ')[1];
    const secret = process.env.SECRET || 'SECRET';
    const decoded = jwt.verify(token!, secret);
    req.body.userData = decoded;
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(new ErrorMessage(StatusCodes.UNAUTHORIZED, 'Auth failed'));
  }
};
