import { ChildProcessWithoutNullStreams } from 'child_process';
import { DataFlowRepository } from '../../domain/repositories/dataFlowRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class DataFlowMongoRepository implements DataFlowRepository {
  backup(): ChildProcessWithoutNullStreams {
    return DatabaseMongo.getDB.backupMongo();
  }
  restore(): ChildProcessWithoutNullStreams {
    throw new Error('Method not implemented.');
  }
}
