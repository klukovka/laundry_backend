import { RepairCompany } from '../models/repairCompany';
import { RepairProduct } from '../models/repairProduct';
import { RepairEvent } from '../models/repairEvent';

export interface RepairCompanyRepository {
  getRepairCompanyId(userId: string): Promise<RepairCompany | null>;
  getRepairCompanies(page: number, size: number): Promise<RepairCompany[]>;
  getRepairCompaniesAmount(): Promise<number>;
  updateRepairCompany(repairCompany: RepairCompany): Promise<void>;
  getRepairCompanyById(repairCompanyId: string): Promise<RepairCompany | null>;

  getRepairProducts(repairCompanyId: string): Promise<RepairProduct[]>;
  getRepairProductsAmount(repairCompanyId: string): Promise<number>;
  updateRepairProduct(repairProductId: string, options: any): Promise<void>;
  deleteRepairProduct(repairProductId: string): Promise<void>;
  createRepairProduct(repairProduct: RepairProduct): Promise<string>;

  getRepairEvents(options: any): Promise<RepairEvent[]>;
  getRepaiEventsAmount(options: any): Promise<number>;
  updateRepairEvent(repairEventId: string, options: any): Promise<void>;
  deleteRepairEvent(repairEventId: string): Promise<void>;
  createRepairEvent(repairEvent: RepairEvent): Promise<string>;
}
