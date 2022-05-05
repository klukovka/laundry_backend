import { Request, Response } from 'express';
import { LaundryMongoRepository } from '../../data/repositories/laundryMongoRepository';
import { ErrorMessage } from '../../domain/models/errorMessage';
import { LaundryService } from '../../domain/services/laundryService';
import Roles from '../utils/roles';
import StatusCodes from '../utils/statusCodes';

const laundryService = new LaundryService(new LaundryMongoRepository());

export default (req: Request, res: Response, next: any) => {
  switch (req.body.userData.role) {
    case Roles.LAUNDRY:
      req.body.userData.laundryId = req.body.userData.id;
      next();
      break;

    case Roles.EMPLOYEE:
      laundryService
        .getEmployeeByUserId(req.body.userData.userId)
        .then((employee) => {
          req.body.userData.laundryId = employee?.laundryId;
          next();
        })
        .catch((error) => {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json(
              new ErrorMessage(StatusCodes.NOT_FOUND, 'There are no employee')
            );
        });
      break;

    default:
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(
          new ErrorMessage(
            StatusCodes.NOT_FOUND,
            'There are no employee or no laundry'
          )
        );
  }
};
