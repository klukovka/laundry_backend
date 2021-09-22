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

router.delete('/:idMode', (req: Request, res: Response, next: any) => {
  modeService
    .delete(req.params.idMode)
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

router.patch('/:idMode', (req: Request, res: Response, next: any) => {
  modeService
    .update(req.params.idMode, req.body)
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

router.get('/:idMode', (req: Request, res: Response, next: any) => {
  modeService
    .getById(req.params.idMode)
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
