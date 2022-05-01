export interface RepairCompanyRepository {
  getRepairCompanyId(userId: string): Promise<string>;
}
