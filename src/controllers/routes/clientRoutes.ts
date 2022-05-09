import { Router, Request, Response } from 'express';
import checkAuth from '../middleware/checkAuth';
import checkAdmin from '../middleware/checkAdmin';
import checkClient from '../middleware/checkClient';
import StatusCodes from '../utils/statusCodes';
import { ErrorMessage } from '../../domain/models/errorMessage';
import { ClientService } from '../../domain/services/clientService';
import { ClientMongoRepository } from '../../data/repositories/clientMongoRepository';

const router = Router();
const clientService = new ClientService(new ClientMongoRepository());

router.get(
  '/all',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    clientService
      .getClients(req.query)
      .then((data) => {
        return res.status(StatusCodes.OK).json(data);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.get(
  '/client-info',
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    clientService
      .getClientByUserId(req.body.userData.userId)
      .then((data) => {
        return res.status(StatusCodes.OK).json(data);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.put(
  '/update-client',
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    clientService
      .updateClient(req.body)
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
