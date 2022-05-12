import { Router, Request, Response } from 'express';
import { LaundryMongoRepository } from '../../data/repositories/laundryMongoRepository';
import { LaundryService } from '../../domain/services/laundryService';
import checkAuth from '../middleware/checkAuth';
import checkIOT from '../middleware/checkIOT';
import checkAdminClient from '../middleware/checkAdminClient';
import checkLaundry from '../middleware/checkLaundry';
import checkLaundryEmployee from '../middleware/checkLaundryEmployee';
import checkClient from '../middleware/checkClient';
import StatusCodes from '../utils/statusCodes';
import { ErrorMessage } from '../../domain/models/errorMessage';
import { EventService } from '../../domain/services/eventService';
import { EventMongoRepository } from '../../data/repositories/eventMongoRepository';
import { ClientMongoRepository } from '../../data/repositories/clientMongoRepository';

const router = Router();
const eventService = new EventService(
  new EventMongoRepository(),
  new ClientMongoRepository(),
  new LaundryMongoRepository()
);

router.post(
  '/setup-event',
  checkAuth,
  checkIOT,
  (req: Request, res: Response, next: any) => {
    eventService
      .setupEvent(req.body)
      .then((eventId) => {
        return res.status(StatusCodes.CREATED).json({ eventId: eventId });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.post(
  '/pay-for-event',
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    eventService
      .payForEvent(req.body)
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

router.post(
  '/take-event/:eventId',
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    eventService
      .takeEvent(req.params.eventId)
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

router.post(
  '/rate-event/:eventId',
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    eventService
      .rateEvent(req.params.eventId, req.body.mark)
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
