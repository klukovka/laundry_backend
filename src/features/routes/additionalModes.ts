import { Router, Request, Response } from 'express';
import { AdditionalModeMongoRepository } from '../../data/repositories/additionalModeMongoRepository';
import { AdditionalMode } from '../../domain/models/additionalMode';
import { AdditionalModeService } from '../../domain/services/additionalModeService';
import StatusCodes from '../utils/statusCodes';

const router = Router();
const additionalModeService = new AdditionalModeService(
  new AdditionalModeMongoRepository()
);

router.post('/', (req: Request, res: Response, next: any) => {
  const { name, time, costs } = req.body;
  const newAdditionalMode = new AdditionalMode(name, time, costs);

  additionalModeService
    .create(newAdditionalMode)
    .then(() => {
      res.status(StatusCodes.OK).json({
        message: 'Additional Mode was created!',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.delete(
  '/:additionalModeId',
  (req: Request, res: Response, next: any) => {
    additionalModeService
      .delete(req.params.additionalModeId)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Additional Mode was deleted!',
        });
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.patch('/:additionalModeId', (req: Request, res: Response, next: any) => {
  additionalModeService
    .update(req.params.additionalModeId, req.body)
    .then(() => {
      res.status(StatusCodes.OK).json({
        message: 'Additional Mode was updated!',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.get('/:additionalModeId', (req: Request, res: Response, next: any) => {
  additionalModeService
    .getById(req.params.additionalModeId)
    .then((additionalMode) => {
      if (additionalMode) {
        res.status(StatusCodes.OK).json(additionalMode);
      } else {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'Additional Mode is not exist' });
      }
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.get('/', (req: Request, res: Response, next: any) => {
  additionalModeService
    .getAll()
    .then((additionalModes) => {
      res.status(StatusCodes.OK).json(additionalModes);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

export default router;
