import { ChildProcessWithoutNullStreams } from 'child_process';

export interface DataFlowRepository {
  backup(): ChildProcessWithoutNullStreams;
  restore(backup: string): ChildProcessWithoutNullStreams;
}
