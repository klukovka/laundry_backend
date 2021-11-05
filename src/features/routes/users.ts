import { Router, Request, Response } from 'express';
import { UserMongoRepository } from '../../data/repositories/userMongoRepository';
import { User } from '../../domain/models/user';
import { UserService } from '../../domain/services/userService';
import StatusCodes from '../utils/statusCodes';

const router = Router();
const userService = new UserService(new UserMongoRepository());

router.post('/signup', (req: Request, res: Response, next: any) => {
  const { email, password, role } = req.body;
  const newUser = new User(email, password, role);

  userService
    .getByEmail(email)
    .then((user) => {
      if (user) {
        return res.status(StatusCodes.CONFLICT).json({
          message: 'Mail exists',
        });
      }

      userService
        .create(newUser)
        .then((userId) => {
          return res.status(StatusCodes.CREATED).json({
            userId: userId,
            message: 'User created',
          });
        })
        .catch((error) => {
          res.status(StatusCodes.INTERNAL_ERROR).json({
            message: error,
          });
        });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error,
      });
    });
});

router.post('/login', (req: Request, res: Response, next: any) => {
  const { email, password } = req.body;
  const user = new User(email, password);

  userService
    .login(user)
    .then((token) => {
      if (token) {
        return res.status(StatusCodes.OK).json({
          message: 'Auth successful',
          token: token,
        });
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'Invalid password' });
      }
    })
    .catch((error) => {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: error });
    });
});

router.delete('/:userId', (req: Request, res: Response, next: any) => {
  userService
    .delete(req.params.userId)
    .then(() =>
      res.status(StatusCodes.OK).json({
        message: 'User was deleted!',
      })
    )
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.patch('/:userId', (req: Request, res: Response, next: any) => {
  userService
    .update(req.params.userId, req.body)
    .then(() =>
      res.status(StatusCodes.OK).json({
        message: 'User was updated!',
      })
    )
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

router.post('/forgot', (req: Request, res: Response, next: any) => {
  const { email } = req.body;

  userService
    .forgotPassword(email)
    .then((result) => res.status(StatusCodes.OK).json(result))
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });
});

export default router;
