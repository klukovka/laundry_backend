import { Employee } from '../../domain/models/employee';
import { Laundry } from '../../domain/models/laundry';
import { User } from '../../domain/models/user';
import { EmployeeRepository } from '../../domain/repositories/employeeRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class EmployeeMongoRepository implements EmployeeRepository {
  async getEmployeeId(userId: string): Promise<Employee | null> {
    try {
      const user = await DatabaseMongo.getDB.getEmployeeByUserId(userId);
      return this._getEmployee(user);
    } catch (error) {
      throw error;
    }
  }

  private _getEmployee(employee: any): Employee | null {
    if (!employee) {
      return null;
    }
    return new Employee(
      employee?.name,
      employee?.phone,
      employee?.birthday,
      employee?.laundry?._id.toString(),
      employee?.user?._id.toString(),
      employee?._id.toString(),
      new Laundry(
        employee?.laundry?.name,
        employee?.laundry?.address,
        employee?.laundry?.phone,
        employee?.laundry?.maxAmount,
        employee?.laundry?.user?._id.toString()
      ),
      new User(
        employee?.user?.email,
        employee?.user?.role,
        null,
        employee?.user?._id.toString()
      )
    );
  }
}
