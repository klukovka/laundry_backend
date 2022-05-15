import { Router, Request, Response } from "express";
import { LaundryMongoRepository } from "../../data/repositories/laundryMongoRepository";
import { LaundryService } from "../../domain/services/laundryService";
import checkAuth from "../middleware/checkAuth";
import checkEmployee from "../middleware/checkEmployee";
import checkAdmin from "../middleware/checkAdmin";
import StatusCodes from "../utils/statusCodes";
import { ErrorMessage } from "../../domain/models/errorMessage";

const router = Router();
const laundryService = new LaundryService(new LaundryMongoRepository());

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

export default router;
