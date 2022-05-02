import { Employee } from '../../domain/models/employee';
import { Laundry } from '../../domain/models/laundry';
import { User } from '../../domain/models/user';
import { LaundryRepository } from '../../domain/repositories/laundryRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class LaundryMongoRepository implements LaundryRepository {
  async getLaundryByUserId(userId: string): Promise<Laundry | null> {
    try {
      const user = await DatabaseMongo.getDB.getLaundryByUserId(userId);
      return this._getLaundry(user);
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeByUserId(userId: string): Promise<Employee | null> {
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

  private _getLaundry(laundry: any): Laundry | null {
    if (!laundry) {
      return null;
    }
    return new Laundry(
      laundry?.name,
      laundry?.address,
      laundry?.phone,
      laundry?.maxAmount,
      laundry?.user?._id.toString(),
      laundry?._id.toString(),
      new User(
        laundry?.user?.email,
        laundry?.user?.role,
        null,
        laundry?.user?._id.toString()
      )
    );
  }
}
