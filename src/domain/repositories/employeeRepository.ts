import { Employee } from '../models/employee';

export interface EmployeeRepository {
  create(employee: Employee): Promise<void>;
  update(employeeId: string, options: Map<string, any>): Promise<void>;
  delete(employeeId: string): Promise<void>;
  get(employeeId: string): Promise<Employee | null>;
  getAll(): Promise<Array<Employee>>;
  getWithInfo(employeeId: string): Promise<Employee | null>;
  getAllWithInfo(): Promise<Array<Employee>>;
}
