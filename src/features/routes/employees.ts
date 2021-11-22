import { Router, Request, Response } from 'express';
import { EmployeeMongoRepository } from '../../data/repositories/employeeMongoRepository';
import { Employee } from '../../domain/models/employee';
import { EmployeeService } from '../../domain/services/employeeService';
import StatusCodes from '../utils/statusCodes';
import checkAuth from '../middleware/checkAuth';
import checkAdmin from '../middleware/checkAdmin';
import checkAdminEmployee from '../middleware/checkAdminEmployee';

const router = Router();
const employeeService = new EmployeeService(new EmployeeMongoRepository());

router.post(
  '/',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    const { name, surname, phone, userId, birthday, laundryId } = req.body;
    console.log(birthday);
    const newEmployee = new Employee(
      name,
      surname,
      phone,
      new Date(birthday),
      laundryId,
      userId
    );

    employeeService
      .create(newEmployee)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Employee was created!',
        });
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.delete(
  '/:employeeId',
  checkAuth,
  checkAdmin,
  (req: Request, res: Response, next: any) => {
    employeeService
      .delete(req.params.employeeId)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Employee was deleted!',
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
  '/:employeeId',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    employeeService
      .update(req.params.employeeId, req.body)
      .then(() => {
        res.status(StatusCodes.OK).json({
          message: 'Employee was updated!',
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
  '/byId/:employeeId',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    employeeService
      .get(req.params.employeeId)
      .then((employee) => {
        if (employee) {
          res.status(StatusCodes.OK).json(employee);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Employee is not exist' });
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
  '/allInfo/:employeeId',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    employeeService
      .getWithInfo(req.params.employeeId)
      .then((employee) => {
        if (employee) {
          res.status(StatusCodes.OK).json(employee);
        } else {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Employee is not exist' });
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
  '/',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    employeeService
      .getAll()
      .then((employees) => {
        res.status(StatusCodes.OK).json(employees);
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);

router.get(
  '/allInfo/',
  checkAuth,
  checkAdminEmployee,
  (req: Request, res: Response, next: any) => {
    employeeService
      .getAllWithInfo()
      .then((employees) => {
        res.status(StatusCodes.OK).json(employees);
      })
      .catch((error) => {
        res.status(StatusCodes.INTERNAL_ERROR).json({
          message: error.message,
        });
      });
  }
);
export default router;
