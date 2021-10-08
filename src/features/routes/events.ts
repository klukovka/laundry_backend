import { Router, Request, Response } from 'express';
import { EventMongoRepository } from '../../data/repositories/eventMongoRepository';
import { Event } from '../../domain/models/event';
import { EventService } from '../../domain/services/eventService';
import StatusCodes from '../utils/statusCodes';

const router = Router();
const eventService = new EventService(new EventMongoRepository());

router.post('/', (req: Request, res: Response, next: any) => {
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
});

router.patch(
  '/paidForEvent/:eventId',
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

router.delete('/:eventId', (req: Request, res: Response, next: any) => {
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
});

router.get('/byId/:eventId', (req: Request, res: Response, next: any) => {
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
});

router.get('/allInfo/:eventId', (req: Request, res: Response, next: any) => {
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
});

router.get('/', (req: Request, res: Response, next: any) => {
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

router.get('/allInfo/', (req: Request, res: Response, next: any) => {
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
