import { Router, Request, Response } from 'express';
import { ClientMongoRepository } from '../../data/repositories/clientMongoRepository';
import { Client } from '../../domain/models/client';
import { ClientService } from '../../domain/services/clientService';
import StatusCodes from '../utils/statusCodes';
import checkAuth from '../middleware/checkAuth';

const router = Router();
const clientService = new ClientService(new ClientMongoRepository());

router.post('/', checkAuth, (req: Request, res: Response, next: any) => {
  const { name, surname, phone, userId } = req.body;
  const newClient = new Client(name, surname, phone, userId);

  clientService
    .create(newClient)
    .then(() => {
      res.status(StatusCodes.OK).json({
        message: 'Client was created!',
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.delete(
  '/:clientId',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    clientService
      .delete(req.params.clientId)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Client was deleted!',
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
  '/:clientId',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    clientService
      .update(req.params.clientId, req.body)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Client was updated!',
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
  '/byId/:clientId',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    clientService
      .get(req.params.clientId)
      .then((client) => {
        if (client) {
          res.status(StatusCodes.OK).json(client);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Client is not exist' });
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
  '/allInfo/:clientId',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    clientService
      .getWithInfo(req.params.clientId)
      .then((client) => {
        if (client) {
          res.status(StatusCodes.OK).json(client);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Client is not exist' });
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
  clientService
    .getAll()
    .then((clients) => {
      res.status(StatusCodes.OK).json(clients);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.get('/allInfo/', checkAuth, (req: Request, res: Response, next: any) => {
  clientService
    .getAllWithInfo()
    .then((clients) => {
      res.status(StatusCodes.OK).json(clients);
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});
export default router;
