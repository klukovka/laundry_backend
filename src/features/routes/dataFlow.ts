import { Router, Request, Response } from 'express';
import { DatabaseMongo } from '../../data/dataSource/mongoDB/databaseMongo';
import StatusCodes from '../utils/statusCodes';

const router = Router();

router.get('/backup', (req: Request, res: Response, next: any) => {
  const backupProcess = DatabaseMongo.getDB.backupMongo();

  backupProcess.on('error', (error) => {
    return res.status(StatusCodes.INTERNAL_ERROR).json({
      message: error.message,
    });
  });

  backupProcess.on('exit', (code, signal) => {
    if (code) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Backup process exited with code: ${code}`,
      });
    } else if (signal) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Backup process killed with signal: ${signal}`,
      });
    } else {
      return res.status(StatusCodes.CREATED).json({
        message: 'Successfully backedup the database',
      });
    }
  });
});

export default router;
