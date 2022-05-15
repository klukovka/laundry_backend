import { Router, Request, Response } from "express";
import { StatisticService } from "../../domain/services/statisticService";
import { LaundryMongoRepository } from "../../data/repositories/laundryMongoRepository";
import { EventMongoRepository } from "../../data/repositories/eventMongoRepository";
import { RepairCompanyMongoRepository } from "../../data/repositories/repairCompanyMongoRepository";
import checkAuth from "../middleware/checkAuth";
import checkAdmin from "../middleware/checkAdmin";
import checkLaundryEmployee from "../middleware/checkLaundryEmployee";
import saveLaundryId from "../middleware/saveLaundryId";
import StatusCodes from "../utils/statusCodes";
import { ErrorMessage } from "../../domain/models/errorMessage";

const router = Router();

const statisticService = new StatisticService(
  new EventMongoRepository(),
  new LaundryMongoRepository(),
  new RepairCompanyMongoRepository()
);

router.get(
  "/rating",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    statisticService
      .laundryRatingStatistic(req.body.userData.laundryId)
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
  "/rating-all",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    statisticService
      .allLaundryRatingStatistic(req.query)
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
  "/payment",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    statisticService
      .laundryPaymentStatistic(req.body.userData.laundryId)
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
  "/payment-all",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    statisticService
      .allLaundryPaymentStatistic(req.query)
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
  "/time-and-usage",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    statisticService
      .laundryTimeAndUsageStatistic(req.body.userData.laundryId)
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
  "/time-and-usage-all",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    statisticService
      .allLaundryTimeAndUsageStatistic(req.query)
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
  "/repair",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    statisticService
      .laundryRepairEventStatistic(req.body.userData.laundryId)
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
  "/repair-all",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    statisticService
      .allLaundryRepairEventStatistic(req.query)
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
