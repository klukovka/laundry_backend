import { WashMachine } from '../models/washMachine';

export interface WashMachineRepository {
  create(washMachine: WashMachine): Promise<void>;
  update(washMachineId: string, options: Map<string, any>): Promise<void>;
  delete(washMachineId: string): Promise<void>;
  get(washMachineId: string): Promise<WashMachine | null>;
  getAll(): Promise<Array<WashMachine>>;
  getWithLaundry(washMachineId: string): Promise<WashMachine | null>;
  getAllWithLaundry(): Promise<Array<WashMachine>>;
}
