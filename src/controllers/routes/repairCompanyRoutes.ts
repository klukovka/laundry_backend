import { Router, Request, Response } from 'express';
import Roles from '../utils/roles';
import StatusCodes from '../utils/statusCodes';
import { ErrorMessage } from '../../domain/models/errorMessage';
import checkAuth from '../middleware/checkAuth';
import checkAdmin from '../middleware/checkAdmin';
import checkAdminLaundryEmployee from '../middleware/checkAdminLaundryEmployee';
import checkLaundryEmployee from '../middleware/checkLaundryEmployee';
import checkRepairCompany from '../middleware/checkRepairCompany';
import { RepairCompanyService } from '../../domain/services/repairCompanyService';
import { RepairCompanyMongoRepository } from '../../data/repositories/repairCompanyMongoRepository';

const router = Router();
const repairCompanyService = new RepairCompanyService(
  new RepairCompanyMongoRepository()
);

router.get(
  '/all-companies',
  checkAuth,
  checkAdminLaundryEmployee,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .getRepairCompanies(req.query)
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
  '/edit',
  checkAuth,
  checkRepairCompany,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .updateRepairCompany(req.body)
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
  '/own-products',
  checkAuth,
  checkRepairCompany,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .getRepairProducts(req.body.userData.id)
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
  '/company-products/:repairCompanyId',
  checkAuth,
  checkAdminLaundryEmployee,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .getRepairProducts(req.params.repairCompanyId)
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
  '/edit-repair-product/:repairProductId',
  checkAuth,
  checkRepairCompany,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .updateRepairProduct(req.params.repairProductId, req.body)
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
  '/delete-repair-product/:repairProductId',
  checkAuth,
  checkRepairCompany,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .deleteRepairProduct(req.params.repairProductId)
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
  '/create-repair-product',
  checkAuth,
  checkRepairCompany,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .createRepairProduct(req.body)
      .then((id) => {
        return res.status(StatusCodes.CREATED).json({ repairProductId: id });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.get(
  '/laundry-repair-events/:laundryId',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .getRepairEvents({ laundry: req.params.laundryId })
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
  '/company-repair-events/:repairCompanyId',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .getRepairEvents({ repairCompany: req.params.repairCompanyId })
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
  '/wash-machine-repair-events/:washMachineId',
  checkAuth,
  checkLaundryEmployee,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .getRepairEvents({ washMachine: req.params.washMachineId })
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
  '/delete-repair-event/:repairEventId',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .deleteRepairEvent(req.params.repairEventId)
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
  '/create-repair-event',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .createRepairEvent(req.body)
      .then((data) => {
        return res.status(StatusCodes.OK).json({ repairEventId: data });
      })
      .catch((error) => {
        return res
          .status(StatusCodes.INTERNAL_ERROR)
          .json(new ErrorMessage(StatusCodes.INTERNAL_ERROR, error.toString()));
      });
  }
);

router.put(
  '/done-repair-event:repairEventId',
  checkAuth,
  checkRepairCompany,
  (req: Request, res: Response, next: any) => {
    repairCompanyService
      .updateRepairEvent(req.params.repairEventId, {done:true})
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
