import { Router, Request, Response } from 'express';
import StatusCodes from '../utils/statusCodes';
import { EconomyService } from '../../domain/services/economyService';
import { WashMachineMongoRepository } from '../../data/repositories/washMachineMongoRepository';
import { EventMongoRepository } from '../../data/repositories/eventMongoRepository';

const router = Router();
const service = new EconomyService(
  new WashMachineMongoRepository(),
  new EventMongoRepository()
);

router.get('/laundryEarnings', (req: Request, res: Response, next: any) => {
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
});

export default router;
