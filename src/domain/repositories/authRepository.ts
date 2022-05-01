import { User } from '../models/user';
import { Client } from '../models/client';
import { Employee } from '../models/employee';
import { Laundry } from '../models/laundry';
import { RepairCompany } from '../models/repairCompany';

export interface AuthRepository {
  createAdmin(user: User): Promise<string>;
  createLaundry(laundry: Laundry): Promise<string>;
  createClient(client: Client): Promise<string>;
  createEmployee(employee: Employee): Promise<string>;
  createRepairCompany(repairCompany: RepairCompany): Promise<string>;
  deleteUser(id: string): Promise<void>;
  updateUser(user: User): Promise<void>;
  getByEmail(email: string, showPassword: boolean): Promise<User | null>;
  getById(email: string, showPassword: boolean): Promise<User | null>;
}
