import { Router, Request, Response } from 'express';
import StatusCodes from '../utils/statusCodes';
import { EconomyService } from '../../domain/services/economyService';
import { EventMongoRepository } from '../../data/repositories/eventMongoRepository';
import checkAuth from '../middleware/checkAuth';
import checkAdminEmployee from '../middleware/checkAdminEmployee';

const router = Router();
const service = new EconomyService(new EventMongoRepository());

router.get(
  '/laundryEarnings',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    const { laundryId, beginDate, endDate } = req.body;

    service
      .laundryEarnings(laundryId, beginDate, endDate)
      .then((earnings) => {
        res.status(StatusCodes.OK).json(earnings);
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get(
  '/laundryGivedBonuses',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    const { laundryId, beginDate, endDate } = req.body;

    service
      .laundryGivedBonuses(laundryId, beginDate, endDate)
      .then((bonuses) => {
        res.status(StatusCodes.OK).json(bonuses);
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get(
  '/laundryTakenBonuses',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    const { laundryId, beginDate, endDate } = req.body;

    service
      .laundryTakenBonuses(laundryId, beginDate, endDate)
      .then((bonuses) => {
        res.status(StatusCodes.OK).json(bonuses);
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get(
  '/laundryTheMostPopularMode',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    const { laundryId, beginDate, endDate } = req.body;

    service
      .laundryTheMostPopularMode(laundryId, beginDate, endDate)
      .then((mode) => {
        res.status(StatusCodes.OK).json(mode);
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get(
  '/laundryWashMachinesTimeAndEnergy',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    const { laundryId, beginDate, endDate } = req.body;

    service
      .laundryWashMachinesTimeAndEnergy(laundryId, beginDate, endDate)
      .then((mode) => {
        res.status(StatusCodes.OK).json(mode);
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get(
  '/laundryRating/:id',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    service
      .laundryRating(req.params.id)
      .then((mode) => {
        res.status(StatusCodes.OK).json(mode);
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

export default router;
