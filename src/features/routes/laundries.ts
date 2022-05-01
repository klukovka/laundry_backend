import { Router, Request, Response } from 'express';
import { LaundryMongoRepository } from '../../data/repositories/laundryMongoRepository';
import { Laundry } from '../../domain/models/laundry';
import { LaundryService } from '../../domain/services/laundryService';
import StatusCodes from '../utils/statusCodes';
import checkAuth from '../middleware/checkAuth';
import checkAdmin from '../middleware/checkAdmin';
import checkAdminClient from '../middleware/checkAdminClient';
import checkAdminEmployee from '../middleware/checkAdminEmployee';
import { EconomyService } from '../../domain/services/economyService';
import { EventMongoRepository } from '../../data/repositories/eventMongoRepository';

const router = Router();
const laundryService = new LaundryService(new LaundryMongoRepository());

const service = new EconomyService(new EventMongoRepository());

router.post(
  '/',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    const { name, city, street, house, phone } = req.body;
    const newLaundry = new Laundry(name, city, street, house, phone);

    laundryService
      .create(newLaundry)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Laundry was created!',
        });
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.delete(
  '/:laundryId',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    laundryService
      .delete(req.params.laundryId)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Laundry was deleted!',
        });
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.patch(
  '/:laundryId',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    console.log(req.body);
    laundryService
      .update(req.params.laundryId, req.body)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Laundry was updated!',
        });
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get(
  '/:laundryId',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getById(req.params.laundryId)
      .then((laundry) => {
        if (laundry) {
          res.status(StatusCodes.OK).json(laundry);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Laundry is not exist' });
        }
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get(
  '/',
  checkAuth,
  checkAdminClient,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getAll()
      .then((laundries) => {
        res.status(StatusCodes.OK).json(laundries);
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

export default router;
