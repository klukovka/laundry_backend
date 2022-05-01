import { RepairCompany } from './repairCompany';
import { WashMachine } from './washMachine';

export class RepairEvent {
  repairEventId?: string | null;
  costs: number;
  description: string;
  type: string;
  date: Date;
  washMachineId: string;
  washMachine: WashMachine | null;
  repairCompanyId: string;
  repairCompany: RepairCompany | null;

  constructor(
    costs: number,
    description: string,
    type: string,
    date: Date,
    washMachineId: string,
    repairCompanyId: string,
    repairEventId: string | null = null,
    repairCompany: RepairCompany | null = null,
    washMachine: WashMachine | null = null
  ) {
    this.costs = costs;
    this.description = description;
    this.type = type;
    this.date = date;
    this.washMachineId = washMachineId;
    this.repairCompanyId = repairCompanyId;
    this.repairEventId = repairEventId;
    this.repairCompany = repairCompany;
    this.washMachine = washMachine;
  }
}
