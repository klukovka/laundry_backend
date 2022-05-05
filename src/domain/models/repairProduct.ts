import { RepairCompany } from './repairCompany';

export class RepairProduct {
  repairProductId?: string | null;
  costs: number;
  description: string;
  type: string;
  repairCompanyId: string;
  repairCompany: RepairCompany | null;

  constructor(
    costs: number,
    description: string,
    type: string,
    repairCompanyId: string,
    repairProductId: string | null = null,
    repairCompany: RepairCompany | null = null
  ) {
    this.costs = costs;
    this.description = description;
    this.type = type;
    this.repairCompanyId = repairCompanyId;
    this.repairProductId = repairProductId;
    this.repairCompany = repairCompany;
  }
}
