import { ChildProcessWithoutNullStreams } from 'child_process';
import { DataFlowRepository } from '../repositories/dataFlowRepository';

export class DataFlowService {
  private _repository: DataFlowRepository;

  constructor(repository: DataFlowRepository) {
    this._repository = repository;
  }

  backup(): ChildProcessWithoutNullStreams {
    return this._repository.backup();
  }

  restore(backup: string): ChildProcessWithoutNullStreams {
    return this._repository.restore(backup);
  }

  getAllBackups(): string[] {
    try {
      return this._repository.getAllBackups();
    } catch (error) {
      throw error;
    }
  }
}
