import { Request, Response } from 'express';
import StatusCodes from '../utils/statusCodes';

export default (req: Request, res: Response, next: any) => {
  try {
    const role = req.body.userData.role;
    if (role == 'client' || role == 'employee') {
      next();
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'There are no client or employee',
      });
    }
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Auth failed',
    });
  }
};
