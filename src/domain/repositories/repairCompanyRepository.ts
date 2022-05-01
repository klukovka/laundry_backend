import { RepairCompany } from '../models/repairCompany';

export interface RepairCompanyRepository {
  getRepairCompanyId(userId: string): Promise<RepairCompany | null>;
}
