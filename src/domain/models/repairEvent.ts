import { RepairProduct } from './repairProduct';
import { WashMachine } from './washMachine';

export class RepairEvent {
  repairEventId?: string | null;
  costs: number;
  date: Date;
  washMachineId: string;
  washMachine: WashMachine | null;
  repairProductId: string;
  repairProduct: RepairProduct | null;
  done: boolean;

  constructor(
    costs: number,
    date: Date,
    washMachineId: string,
    repairProductId: string,
    done: boolean = false,
    repairEventId: string | null = null,
    repairProduct: RepairProduct | null = null,
    washMachine: WashMachine | null = null
  ) {
    this.costs = costs;
    this.date = date;
    this.washMachineId = washMachineId;
    this.repairProductId = repairProductId;
    this.repairEventId = repairEventId;
    this.repairProduct = repairProduct;
    this.washMachine = washMachine;
    this.done = done;
  }
}
