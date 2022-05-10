import { Router, Request, Response } from 'express';
import { AuthService } from '../../domain/services/authService';
import { AuthMongoRepository } from '../../data/repositories/authMongoRepository';
import { ClientMongoRepository } from '../../data/repositories/clientMongoRepository';
import { RepairCompanyMongoRepository } from '../../data/repositories/repairCompanyMongoRepository';
import { LaundryMongoRepository } from '../../data/repositories/laundryMongoRepository';
import { User } from '../../domain/models/user';
import Roles from '../utils/roles';
import StatusCodes from '../utils/statusCodes';
import { ErrorMessage } from '../../domain/models/errorMessage';
import checkAuth from '../middleware/checkAuth';
import checkAdmin from '../middleware/checkAdmin';
import checkLaundry from '../middleware/checkLaundry';

const router = Router();
const authService = new AuthService(
  new AuthMongoRepository(),
  new ClientMongoRepository(),
  new RepairCompanyMongoRepository(),
  new LaundryMongoRepository()
);

router.post('/login', (req: Request, res: Response, next: any) => {
  const { email, password } = req.body;

  authService
    .login(email, password)
    .then((data) => {
      return res.status(StatusCodes.OK).json(data);
    })
    .catch((error) => {
      return res
        .status(StatusCodes.INTERNAL_ERROR)
        .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
    });
});

router.post(
  '/signup-admin',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    const { email, password } = req.body;
    const user = new User(email, Roles.ADMIN, password);

    authService
      .createUser(user)
      .then((userId) => {
        return res.status(StatusCodes.CREATED).json({
          userId: userId,
        });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.post(
  '/signup-iot',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    const { email, password } = req.body;
    const user = new User(email, Roles.IOT, password);

    authService
      .createUser(user)
      .then((userId) => {
        return res.status(StatusCodes.CREATED).json({
          userId: userId,
        });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.post(
  '/signup-laundry',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    authService
      .createLaundry(req.body)
      .then((userId) => {
        return res.status(StatusCodes.CREATED).json({
          userId: userId,
        });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.post('/signup-client', (req: Request, res: Response, next: any) => {
  authService
    .createClient(req.body)
    .then((userId) => {
      return res.status(StatusCodes.CREATED).json({
        userId: userId,
      });
    })
    .catch((error) => {
      return res
        .status(StatusCodes.INTERNAL_ERROR)
        .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
    });
});

router.post(
  '/signup-repair-company',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    authService
      .createRepairCompany(req.body)
      .then((userId) => {
        return res.status(StatusCodes.CREATED).json({
          userId: userId,
        });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.post(
  '/signup-employee',
  checkAuth,
  checkLaundry,
  (req: Request, res: Response, next: any) => {
    req.body.laundryId = req.body.userData.id;
    authService
      .createEmployee(req.body)
      .then((userId) => {
        return res.status(StatusCodes.CREATED).json({
          userId: userId,
        });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.post('/forget', (req: Request, res: Response, next: any) => {
  authService
    .forgotPassword(req.body.email)
    .then((_) => {
      return res.status(StatusCodes.OK).json();
    })
    .catch((error) => {
      return res
        .status(StatusCodes.INTERNAL_ERROR)
        .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
    });
});

router.delete(
  '/delete-account',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    authService
      .deleteUser(req.body.userData.userId)
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

router.patch(
  '/update-password',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    authService
      .updatePassword(
        req.body.userData.email,
        req.body.password,
        req.body.newPassword
      )
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
