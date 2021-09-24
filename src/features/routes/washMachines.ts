import { Router, Request, Response } from 'express';
import StatusCodes from '../utils/statusCodes';
import { WashMachineService } from '../../domain/services/washMachineService';
import { WashMachineMongoRepository } from '../../data/repositories/washMachineMongoRepository';
import { WashMachine } from '../../domain/models/washMachine';

const router = Router();
const washMachineService = new WashMachineService(
  new WashMachineMongoRepository()
);

router.post('/', (req: Request, res: Response, next: any) => {
  const {
    model,
    manufacturer,
    capacity,
    powerUsage,
    spinningSpeed,
    laundryId,
  } = req.body;

  const newWashMachine = new WashMachine(
    model,
    manufacturer,
    capacity,
    powerUsage,
    spinningSpeed,
    laundryId
  );

  washMachineService
    .create(newWashMachine)
    .then(() => {
      res.status(StatusCodes.OK).json({
        message: 'WashMachine was created!',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.delete('/:washMachineId', (req: Request, res: Response, next: any) => {
  washMachineService
    .delete(req.params.washMachineId)
    .then(() => {
      res.status(StatusCodes.OK).json({
        message: 'WashMachine was deleted!',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.patch('/:washMachineId', (req: Request, res: Response, next: any) => {
  washMachineService
    .update(req.params.washMachineId, req.body)
    .then(() => {
      res.status(StatusCodes.OK).json({
        message: 'WashMachine was updated!',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.get('/byId/:washMachineId', (req: Request, res: Response, next: any) => {
  washMachineService
    .get(req.params.washMachineId)
    .then((washMachine) => {
      if (washMachine) {
        res.status(StatusCodes.OK).json(washMachine);
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'WashMachine is not exist' });
      }
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.get(
  '/allInfo/:washMachineId',
  (req: Request, res: Response, next: any) => {
    washMachineService
      .getWithLaundry(req.params.washMachineId)
      .then((washMachine) => {
        if (washMachine) {
          res.status(StatusCodes.OK).json(washMachine);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'WashMachine is not exist' });
        }
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get('/', (req: Request, res: Response, next: any) => {
  washMachineService
    .getAll()
    .then((washMachines) => {
      res.status(StatusCodes.OK).json(washMachines);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.get('/allInfo/', (req: Request, res: Response, next: any) => {
  washMachineService
    .getAllWithLaundry()
    .then((washMachines) => {
      res.status(StatusCodes.OK).json(washMachines);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});
export default router;
