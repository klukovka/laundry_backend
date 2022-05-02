import { Router, Request, Response } from 'express';
import { LaundryMongoRepository } from '../../data/repositories/laundryMongoRepository';
import { LaundryService } from '../../domain/services/laundryService';
import checkAuth from '../middleware/checkAuth';
import checkAdminClient from '../middleware/checkAdminClient';
import checkLaundry from '../middleware/checkLaundry';
import StatusCodes from '../utils/statusCodes';
import { ErrorMessage } from '../../domain/models/errorMessage';

const router = Router();
const laundryService = new LaundryService(new LaundryMongoRepository());

router.get(
  '/all',
  checkAuth,
  checkAdminClient,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getLaundries(req.query)
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
  '/personal-info',
  checkAuth,
  checkLaundry,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getLaundryByUserId(req.body.userData.userId)
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

router.put(
  '/update-laundry',
  checkAuth,
  checkLaundry,
  (req: Request, res: Response, next: any) => {
    laundryService
      .updateLaundry(req.body)
      .then((_) => {
        return res.status(StatusCodes.OK).json();
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

export default router;
