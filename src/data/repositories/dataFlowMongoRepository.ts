import { ChildProcessWithoutNullStreams } from 'child_process';
import { DataFlowRepository } from '../../domain/repositories/dataFlowRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class DataFlowMongoRepository implements DataFlowRepository {
  restore(backup: string): ChildProcessWithoutNullStreams {
    return DatabaseMongo.getDB.restoreMongo(backup);
  }
  backup(): ChildProcessWithoutNullStreams {
    return DatabaseMongo.getDB.backupMongo();
  }
}
