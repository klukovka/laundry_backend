import { Router, Request, Response } from 'express';
import { EmployeeMongoRepository } from '../../data/repositories/employeeMongoRepository';
import { Employee } from '../../domain/models/employee';
import { EmployeeService } from '../../domain/services/employeeService';
import StatusCodes from '../utils/statusCodes';
import checkAuth from '../middleware/checkAuth';

const router = Router();
const employeeService = new EmployeeService(new EmployeeMongoRepository());

router.post('/', checkAuth, (req: Request, res: Response, next: any) => {
  const { name, surname, phone, userId, day, month, year, laundryId } =
    req.body;
  const newEmployee = new Employee(
    name,
    surname,
    phone,
    new Date(year, month, day),
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
});

router.delete(
  '/:employeeId',
  checkAuth,
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

router.get('/', checkAuth, (req: Request, res: Response, next: any) => {
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
});

router.get('/allInfo/', checkAuth, (req: Request, res: Response, next: any) => {
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
});
export default router;
