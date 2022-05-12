import { Request, Response } from 'express';
import { ErrorMessage } from '../../domain/models/errorMessage';
import Roles from '../utils/roles';
import StatusCodes from '../utils/statusCodes';

export default (req: Request, res: Response, next: any) => {
  try {
    const role = req.body.userData.role;
    if (role == Roles.IOT) {
      next();
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new ErrorMessage(StatusCodes.NOT_FOUND, 'There is no IOT'));
    }
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(new ErrorMessage(StatusCodes.UNAUTHORIZED, 'Auth is failed'));
  }
};
