import { ChildProcessWithoutNullStreams } from "child_process";

export interface DataFlowRepository {
  backup(): Promise<void>;
  restore(backup: string): Promise<void>;
  getAllBackups(): Array<string>;
}
