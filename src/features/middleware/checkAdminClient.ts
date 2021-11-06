import { Request, Response } from 'express';
import StatusCodes from '../utils/statusCodes';

export default (req: Request, res: Response, next: any) => {
  try {
    const role = req.body.userData.role;
    if (role == 'admin' || role == 'client') {
      next();
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'There are no admin or client',
      });
    }
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Auth failed',
    });
  }
};
