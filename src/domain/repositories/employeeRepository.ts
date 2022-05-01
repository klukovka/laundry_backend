export interface EmployeeRepository {
  getEmployeeId(userId: string): Promise<string>;
}
