import { Router, Request, Response } from "express";
import { DataFlowMongoRepository } from "../../data/repositories/dataFlowMongoRepository";
import { DataFlowService } from "../../domain/services/dataFlowService";
import StatusCodes from "../utils/statusCodes";
import checkAuth from "../middleware/checkAuth";
import checkAdmin from "../middleware/checkAdmin";
import { ErrorMessage } from "../../domain/models/errorMessage";

const router = Router();
const dataFlowService = new DataFlowService(new DataFlowMongoRepository());

router.get(
  "/all",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    try {
      const backups = dataFlowService.getAllBackups();
      res.status(StatusCodes.OK).json({
        message: "Successfully get backups",
        backups: backups,
      });
    } catch (error: any) {
      return res
        .status(StatusCodes.INTERNAL_ERROR)
        .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error));
    }
  }
);

router.get(
  "/backup",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    dataFlowService
      .backup()
      .then(() => {
        return res.status(StatusCodes.CREATED).json({
          message: "Successfully backedup the database",
        });
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, err));
      });
  }
);

router.post(
  "/restore/:backupId",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    dataFlowService
      .restore(req.params.backupId)
      .then(() => {
        return res.status(StatusCodes.CREATED).json({
          message: "Successfully restore the database",
        });
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, err));
      });
  }
);

export default router;
