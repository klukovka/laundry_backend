import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import StatusCodes from '../utils/statusCodes';

export default (req: Request, res: Response, next: any) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const secret = process.env.SECRET || 'SECRET';
    const decoded = jwt.verify(token, secret);
    req.query.userData = decoded;
    console.log(req.query);
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Auth failed',
    });
  }
};
