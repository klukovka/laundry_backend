import { Employee } from '../models/employee';
import { Laundry } from '../models/laundry';

export interface LaundryRepository {
  getLaundryByUserId(userId: string): Promise<Laundry | null>;
  getEmployeeByUserId(userId: string): Promise<Employee | null>;
}
