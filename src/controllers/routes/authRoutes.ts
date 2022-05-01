import { Router, Request, Response } from 'express';
import { AuthService } from '../../domain/services/authService';
import { AuthMongoRepository } from '../../data/repositories/authMongoRepository';
import { ClientMongoRepository } from '../../data/repositories/clientMongoRepository';
import { EmployeeMongoRepository } from '../../data/repositories/employeeMongoRepository';
import { RepairCompanyMongoRepository } from '../../data/repositories/repairCompanyMongoRepository';
import { LaundryMongoRepository } from '../../data/repositories/laundryMongoRepository';
import { User } from '../../domain/models/user';
import Roles from '../utils/roles';
import StatusCodes from '../utils/statusCodes';
import { ErrorMessage } from '../../domain/models/errorMessage';

const router = Router();
const authService = new AuthService(
  new AuthMongoRepository(),
  new ClientMongoRepository(),
  new EmployeeMongoRepository(),
  new RepairCompanyMongoRepository(),
  new LaundryMongoRepository()
);

router.post('/signup-admin', (req: Request, res: Response, next: any) => {
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
});

export default router;
