import { Router, Request, Response } from 'express';
import { ModeMongoRepository } from '../../data/repositories/modeMongoRepository';
import { Mode } from '../../domain/models/mode';
import { ModeService } from '../../domain/services/modeService';
import StatusCodes from '../utils/statusCodes';
import checkAuth from '../middleware/checkAuth';
import checkAdmin from '../middleware/checkAdmin';

const router = Router();
const modeService = new ModeService(new ModeMongoRepository());

router.post(
  '/',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
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
  }
);

router.delete(
  '/:modeId',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
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
  }
);

router.patch(
  '/:modeId',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
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
  }
);

router.get('/:modeId', checkAuth, (req: Request, res: Response, next: any) => {
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

router.get('/', checkAuth, (req: Request, res: Response, next: any) => {
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
