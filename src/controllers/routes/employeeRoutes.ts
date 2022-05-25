import { Router, Request, Response } from "express";
import { LaundryMongoRepository } from "../../data/repositories/laundryMongoRepository";
import { LaundryService } from "../../domain/services/laundryService";
import checkAuth from "../middleware/checkAuth";
import checkEmployee from "../middleware/checkEmployee";
import checkAdmin from "../middleware/checkAdmin";
import StatusCodes from "../utils/statusCodes";
import { ErrorMessage } from "../../domain/models/errorMessage";
import checkLaundry from '../middleware/checkLaundry';
import {AuthService} from '../../domain/services/authService';
import {AuthMongoRepository} from '../../data/repositories/authMongoRepository';
import {ClientMongoRepository} from '../../data/repositories/clientMongoRepository';
import {RepairCompanyMongoRepository} from '../../data/repositories/repairCompanyMongoRepository';

const router = Router();
const laundryService = new LaundryService(new LaundryMongoRepository());
const authService = new AuthService(
  new AuthMongoRepository(),
  new ClientMongoRepository(),
  new RepairCompanyMongoRepository(),
  new LaundryMongoRepository()
);

router.get(
  "/personal-info",
  checkAuth,
  checkEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getEmployeeByUserId(req.body.userData.userId)
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
  "/update-employee",
  checkAuth,
  checkEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .updateEmployee(req.body)
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

router.get(
  "/all-employees",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getAllEmployees(req.query)
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

router.delete(
  "/delete-employee/:userId",
  checkAuth,
  checkLaundry,
  (req: Request, res: Response, next: any) => {
    authService
      .deleteUser(req.params.userId)
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
