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
}
