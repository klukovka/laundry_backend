import { Router, Request, Response } from 'express';
import { DataFlowMongoRepository } from '../../data/repositories/dataFlowMongoRepository';
import { DataFlowService } from '../../domain/services/dataFlowService';
import StatusCodes from '../utils/statusCodes';
import checkAuth from '../middleware/checkAuth';

const router = Router();
const dataFlowService = new DataFlowService(new DataFlowMongoRepository());

router.get('/all', checkAuth, (req: Request, res: Response, next: any) => {
  try {
    const backups = dataFlowService.getAllBackups();
    res.status(StatusCodes.OK).json({
      message: 'Successfully get backups',
      backups: backups,
    });
  } catch (error: any) {
    return res.status(StatusCodes.INTERNAL_ERROR).json({
      error: error,
    });
  }
});

router.get('/backup', checkAuth, (req: Request, res: Response, next: any) => {
  const backupProcess = dataFlowService.backup();

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

router.post(
  '/restore/:backupId',
  checkAuth,
  (req: Request, res: Response, next: any) => {
    const restoreProcess = dataFlowService.restore(req.params.backupId);

    restoreProcess.on('error', (error) => {
      return res.status(StatusCodes.INTERNAL_ERROR).json({
        message: error.message,
      });
    });

    restoreProcess.on('exit', (code, signal) => {
      if (code) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Restore process exited with code: ${code}`,
        });
      } else if (signal) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Restore process killed with signal: ${signal}`,
        });
      } else {
        return res.status(StatusCodes.CREATED).json({
          message: 'Successfully restore the database',
        });
      }
    });
  }
);

export default router;
