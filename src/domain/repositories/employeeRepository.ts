import { Employee } from '../models/employee';

export interface EmployeeRepository {
  getEmployeeId(userId: string): Promise<Employee | null>;
}
