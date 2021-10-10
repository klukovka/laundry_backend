import { Router, Request, Response } from 'express';
import { DataFlowMongoRepository } from '../../data/repositories/dataFlowMongoRepository';
import { DataFlowService } from '../../domain/services/dataFlowService';
import StatusCodes from '../utils/statusCodes';

const router = Router();
const dataFlowService = new DataFlowService(new DataFlowMongoRepository());

router.get('/backup', (req: Request, res: Response, next: any) => {
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

export default router;
