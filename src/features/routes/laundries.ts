import { Router, Request, Response } from 'express';
import { LaundryMongoRepository } from '../../data/repositories/laundryMongoRepository';
import { Laundry } from '../../domain/models/laundry';
import { LaundryService } from '../../domain/services/laundryService';
import StatusCodes from '../utils/statusCodes';

const router = Router();
const laundryService = new LaundryService(new LaundryMongoRepository());

router.post('/', (req: Request, res: Response, next: any) => {
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
});

router.delete('/:idLaundry', (req: Request, res: Response, next: any) => {
  laundryService
    .delete(req.params.idLaundry)
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
});

router.patch('/:idLaundry', (req: Request, res: Response, next: any) => {
  laundryService
    .update(req.params.idLaundry, req.body)
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
});

router.get('/:idLaundry', (req: Request, res: Response, next: any) => {
  laundryService
    .getById(req.params.idLaundry)
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
});

router.get('/', (req: Request, res: Response, next: any) => {
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
});

export default router;