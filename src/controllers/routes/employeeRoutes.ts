import { Router, Request, Response } from 'express';
import { LaundryMongoRepository } from '../../data/repositories/laundryMongoRepository';
import { LaundryService } from '../../domain/services/laundryService';
import checkAuth from '../middleware/checkAuth';
import checkEmployee from '../middleware/checkEmployee';
import checkAdminClient from '../middleware/checkAdminClient';
import checkLaundry from '../middleware/checkLaundry';
import StatusCodes from '../utils/statusCodes';
import { ErrorMessage } from '../../domain/models/errorMessage';

const router = Router();
const laundryService = new LaundryService(new LaundryMongoRepository());

router.get(
  '/personal-info',
  checkAuth,
  checkEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getEmployeeByUserId(req.body.userData.userId)
      .then((data) => {
        return res.status(StatusCodes.OK).json(data);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.get(
  '/update-employee',
  checkAuth,
  checkEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .updateEmployee(req.body)
      .then((_) => {
        return res.status(StatusCodes.OK);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

export default router;
