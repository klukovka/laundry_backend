import { Router, Request, Response } from 'express';
import { ModeMongoRepository } from '../../data/repositories/ModeMongoRepository';
import { Mode } from '../../domain/models/Mode';
import { ModeService } from '../../domain/services/modeService';
import StatusCodes from '../utils/statusCodes';

const router = Router();
const modeService = new ModeService(new ModeMongoRepository());

router.post('/', (req: Request, res: Response, next: any) => {
  const { name, time, costs } = req.body;
  const newMode = new Mode(name, time, costs);

  modeService
    .create(newMode)
    .then(() => {
      res.status(StatusCodes.OK).json({
        message: 'Mode was created!',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.delete('/:modeId', (req: Request, res: Response, next: any) => {
  modeService
    .delete(req.params.modeId)
    .then(() => {
      res.status(StatusCodes.OK).json({
        message: 'Mode was deleted!',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.patch('/:modeId', (req: Request, res: Response, next: any) => {
  modeService
    .update(req.params.modeId, req.body)
    .then(() => {
      res.status(StatusCodes.OK).json({
        message: 'Mode was updated!',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.get('/:modeId', (req: Request, res: Response, next: any) => {
  modeService
    .getById(req.params.modeId)
    .then((mode) => {
      if (mode) {
        res.status(StatusCodes.OK).json(mode);
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Mode is not exist' });
      }
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.get('/', (req: Request, res: Response, next: any) => {
  modeService
    .getAll()
    .then((modes) => {
      res.status(StatusCodes.OK).json(modes);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

export default router;
