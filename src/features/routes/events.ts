import { Router, Request, Response } from 'express';
import { EventMongoRepository } from '../../data/repositories/eventMongoRepository';
import { ClientMongoRepository } from '../../data/repositories/clientMongoRepository';
import { Event } from '../../domain/models/event';
import { EventService } from '../../domain/services/eventService';
import StatusCodes from '../utils/statusCodes';
import checkAuth from '../middleware/checkAuth';
import checkAdminEmployee from '../middleware/checkAdminEmployee';
import checkClient from '../middleware/checkClient';
import checkClientEmployee from '../middleware/checkClientEmployee';

const router = Router();
const eventService = new EventService(
  new EventMongoRepository(),
  new ClientMongoRepository()
);

router.post(
  '/',
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    const { washMachineId, temperature, spinning, modeId, additionalModeId } =
      req.body;
    const newEvent = new Event(
      washMachineId,
      temperature,
      spinning,
      modeId,
      additionalModeId
    );

    eventService
      .create(newEvent)
      .then((id) => {
        res.status(StatusCodes.OK).json({
          message: 'Event was created!',
          id: id,
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
  '/paidForEvent/:eventId',
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    const { client, paidBonuses } = req.body;

    eventService
      .paidForEvent(req.params.eventId, client, paidBonuses)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Event was paid!',
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
  '/takeEvent/:eventId',
  checkAuth,
  checkClientEmployee,
  (req: Request, res: Response, next: any) => {
    eventService
      .takeEvent(req.params.eventId)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Event was taken!',
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
  '/ratingEvent/:eventId',
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    eventService
      .rateEvent(req.params.eventId, req.body.rating)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Event was rated!',
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
  '/:eventId',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    eventService
      .delete(req.params.eventId)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Event was deleted!',
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
  '/byId/:eventId',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    eventService
      .get(req.params.eventId)
      .then((event) => {
        if (event) {
          res.status(StatusCodes.OK).json(event);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Event is not exist' });
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
  '/allInfo/:eventId',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    eventService
      .getWithInfo(req.params.eventId)
      .then((event) => {
        if (event) {
          res.status(StatusCodes.OK).json(event);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Event is not exist' });
        }
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get('/', checkAuth, (req: Request, res: Response, next: any) => {
  eventService
    .getAll()
    .then((events) => {
      res.status(StatusCodes.OK).json(events);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.get('/allInfo/', checkAuth, (req: Request, res: Response, next: any) => {
  eventService
    .getAllWithInfo()
    .then((events) => {
      res.status(StatusCodes.OK).json(events);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});
export default router;
