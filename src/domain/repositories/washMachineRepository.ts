import { WashMachine } from '../models/washMachine';

export interface WashMachineRepository {
  create(washMachine: WashMachine): Promise<void>;
  update(idWashMachine: string, options: Map<string, any>): Promise<void>;
  delete(idWashMachine: string): Promise<void>;
  get(idWashMachine: string): Promise<WashMachine | null>;
  getAll(): Promise<Array<WashMachine>>;
  getWithLaundry(idWashMachine: string): Promise<WashMachine | null>;
  getAllWithLaundry(): Promise<Array<WashMachine>>;
}
