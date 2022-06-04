import { Router, Request, Response } from "express";
import { LaundryMongoRepository } from "../../data/repositories/laundryMongoRepository";
import { LaundryService } from "../../domain/services/laundryService";
import checkAuth from "../middleware/checkAuth";
import checkIOT from "../middleware/checkIOT";
import checkAdmin from "../middleware/checkAdmin";
import checkClientIOT from "../middleware/checkClientIOT";
import checkLaundry from "../middleware/checkLaundry";
import checkLaundryEmployee from "../middleware/checkLaundryEmployee";
import checkClient from "../middleware/checkClient";
import StatusCodes from "../utils/statusCodes";
import { ErrorMessage } from "../../domain/models/errorMessage";
import { EventService } from "../../domain/services/eventService";
import { EventMongoRepository } from "../../data/repositories/eventMongoRepository";
import { ClientMongoRepository } from "../../data/repositories/clientMongoRepository";
import saveLaundryId from "../middleware/saveLaundryId";

const router = Router();
const eventService = new EventService(
  new EventMongoRepository(),
  new ClientMongoRepository(),
  new LaundryMongoRepository()
);

router.post(
  "/setup-event",
  checkAuth,
  checkIOT,
  (req: Request, res: Response, next: any) => {
    eventService
      .setupEvent(req.body)
      .then((eventId) => {
        return res.status(StatusCodes.CREATED).json({ eventId: eventId });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.post(
  "/pay-for-event",
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    eventService
      .payForEvent(req.body)
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

router.post(
  "/take-event/:eventId",
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    eventService
      .takeEvent(req.params.eventId)
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

router.post(
  "/rate-event/:eventId",
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    eventService
      .rateEvent(req.params.eventId, req.body.mark)
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
  "/info/:eventId",
  checkAuth,
  checkClientIOT,
  (req: Request, res: Response, next: any) => {
    eventService
      .getEvent(req.params.eventId)
      .then((event) => {
        return res.status(StatusCodes.OK).json(event);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.get(
  "/client-events",
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    eventService
      .getClientEvents(req.body.userData.id, req.query)
      .then((event) => {
        return res.status(StatusCodes.OK).json(event);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.get(
  "/wash-machine-events/:washMachineId",
  checkAuth,
  (req: Request, res: Response, next: any) => {
    eventService
      .getWashMachineEvents(req.params.washMachineId, req.query)
      .then((event) => {
        return res.status(StatusCodes.OK).json(event);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.get(
  "/laundry-events",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    eventService
      .getLaundryEvents(req.body.userData.laundryId, req.query)
      .then((event) => {
        return res.status(StatusCodes.OK).json(event);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.get(
  "/all",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    eventService
      .getAllEvents(req.query)
      .then((event) => {
        return res.status(StatusCodes.OK).json(event);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.get(
  "/by-id/:eventId",
  checkAuth,
  checkClient,
  (req: Request, res: Response, next: any) => {
    eventService
      .getEvent(req.params.eventId)
      .then((event) => {
        return res.status(StatusCodes.OK).json(event);
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

export default router;
