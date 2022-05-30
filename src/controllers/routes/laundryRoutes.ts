import { Router, Request, Response } from "express";
import { LaundryMongoRepository } from "../../data/repositories/laundryMongoRepository";
import { LaundryService } from "../../domain/services/laundryService";
import checkAuth from "../middleware/checkAuth";
import checkAdminClient from "../middleware/checkAdminClient";
import checkAdmin from "../middleware/checkAdmin";
import checkLaundry from "../middleware/checkLaundry";
import checkLaundryEmployee from "../middleware/checkLaundryEmployee";
import saveLaundryId from "../middleware/saveLaundryId";
import StatusCodes from "../utils/statusCodes";
import { ErrorMessage } from "../../domain/models/errorMessage";

const router = Router();
const laundryService = new LaundryService(new LaundryMongoRepository());

router.get(
  "/all",
  checkAuth,
  checkAdminClient,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getLaundries(req.query)
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
  "/personal-info",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getLaundryByUserId(req.body.userData.userId)
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
   "/by-id/:laundryId",
   checkAuth,
   checkAdmin,
   (req: Request, res: Response, next: any) => {
    laundryService
       .getLaundryById(req.params.laundryId)
       .then((data) => {
         if (data){
         return res.status(StatusCodes.OK).json(data);
        }
         return res.status(StatusCodes.NOT_FOUND).json();
              })
       .catch((error) => {
         return res
           .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
       });
   }
 );

router.put(
  "/update-laundry",
  checkAuth,
  checkLaundry,
  (req: Request, res: Response, next: any) => {
    laundryService
      .updateLaundry(req.body)
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
  checkLaundry,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getLaundryEmployees(req.body.userData.id, req.query)
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
  "/:laundryId/all-employees",
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getLaundryEmployees(req.params.laundryId, req.query)
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



router.post(
  "/create-wash-machine",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    laundryService
      .createWashMachine(req.body.userData.laundryId, req.body)
      .then((data) => {
        return res.status(StatusCodes.CREATED).json({
          washMachineId: data,
        });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.put(
  "/update-wash-machine/:washMachineId",
  checkAuth,
  checkLaundryEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .updateWashMachine(req.params.washMachineId, req.body)
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

router.delete(
  "/delete-wash-machine/:washMachineId",
  checkAuth,
  checkLaundryEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .deleteWashMachine(req.params.washMachineId)
      .then((data) => {
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
  "/all-washing-machines-laundry",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getLaundryWashMachines(req.body.userData.laundryId, req.query)
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
  "/all-washing-machines-users/:laundryId",
  checkAuth,
  checkAdminClient,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getLaundryWashMachines(req.params.laundryId, req.query)
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

router.post(
  "/create-additional-mode",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    laundryService
      .createAdditionalMode(req.body.userData.laundryId, req.body)
      .then((data) => {
        return res.status(StatusCodes.CREATED).json({
          additionalModeId: data,
        });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.put(
  "/update-additional-mode/:additionalModeId",
  checkAuth,
  checkLaundryEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .updateAdditionalMode(req.params.additionalModeId, req.body)
      .then((data) => {
        return res.status(StatusCodes.OK).json();
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.delete(
  "/delete-additional-mode/:additionalModeId",
  checkAuth,
  checkLaundryEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .deleteAdditionalMode(req.params.additionalModeId)
      .then((data) => {
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
  "/all-additional-modes",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getAdditionalModes(req.body.userData.laundryId)
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

router.post(
  "/create-mode",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    laundryService
      .createMode(req.body.userData.laundryId, req.body)
      .then((data) => {
        return res.status(StatusCodes.CREATED).json({
          modeId: data,
        });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.put(
  "/update-mode/:modeId",
  checkAuth,
  checkLaundryEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .updateMode(req.params.modeId, req.body)
      .then((data) => {
        return res.status(StatusCodes.OK).json();
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.delete(
  "/delete-mode/:modeId",
  checkAuth,
  checkLaundryEmployee,
  (req: Request, res: Response, next: any) => {
    laundryService
      .deleteMode(req.params.modeId)
      .then((data) => {
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
  "/all-modes",
  checkAuth,
  checkLaundryEmployee,
  saveLaundryId,
  (req: Request, res: Response, next: any) => {
    laundryService
      .getModes(req.body.userData.laundryId)
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
