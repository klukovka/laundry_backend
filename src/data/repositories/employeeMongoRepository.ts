import { Employee } from '../../domain/models/employee';
import { Laundry } from '../../domain/models/laundry';
import { User } from '../../domain/models/user';
import { EmployeeRepository } from '../../domain/repositories/employeeRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class EmployeeMongoRepository implements EmployeeRepository {
  async create(employee: Employee): Promise<void> {
    try {
      await DatabaseMongo.getDB.createEmployee(employee);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async update(employeeId: string, options: Map<string, any>): Promise<void> {
    try {
      const optionsObject = {
        name: options.get('name'),
        surname: options.get('surname'),
        phone: options.get('phone'),
        birthday: new Date(
          options.get('year'),
          options.get('month'),
          options.get('day')
        ),
        laundry: options.get('laundry'),
        user: options.get('user'),
      };
      await DatabaseMongo.getDB.updateEmployee(employeeId, optionsObject);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(employeeId: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteEmployee(employeeId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async get(employeeId: string): Promise<Employee | null> {
    try {
      const employee = await DatabaseMongo.getDB.getEmployee(employeeId);
      if (employee) {
        return new Employee(
          employee.name,
          employee.surname,
          employee.phone,
          employee.birthday,
          employee.laundry?._id.toString(),
          employee.user?._id.toString(),
          employee?._id.toString()
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAll(): Promise<Employee[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllEmployees();
      let clients = new Array<Employee>();

      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          clients.push(
            new Employee(
              documents[i].name,
              documents[i].surname,
              documents[i].phone,
              documents[i].birthday,
              documents[i].laundry?._id.toString(),
              documents[i].user?._id.toString(),
              documents[i]?._id.toString()
            )
          );
        }
      }
      return clients;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getWithInfo(employeeId: string): Promise<Employee | null> {
    try {
      const employee = await DatabaseMongo.getDB.getEmployeeWithInfo(
        employeeId
      );
      if (employee) {
        return new Employee(
          employee.name,
          employee.surname,
          employee.phone,
          employee.birthday,
          employee.laundry?._id.toString(),
          employee.user?._id.toString(),
          employee?._id.toString(),
          new Laundry(
            employee.laundry?.name,
            employee.laundry?.city,
            employee.laundry?.street,
            employee.laundry?.house,
            employee.laundry?.phone,
            employee.laundry?._id.toString()
          ),
          new User(
            employee.user?.email,
            '',
            employee.user?.role,
            employee.user?._id.toString()
          )
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllWithInfo(): Promise<Employee[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllEmployeesWithInfo();
      let clients = new Array<Employee>();

      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          clients.push(
            new Employee(
              documents[i].name,
              documents[i].surname,
              documents[i].phone,
              documents[i].birthday,
              documents[i].laundry?._id.toString(),
              documents[i].user?._id.toString(),
              documents[i]?._id.toString(),
              new Laundry(
                documents[i].laundry?.name,
                documents[i].laundry?.city,
                documents[i].laundry?.street,
                documents[i].laundry?.house,
                documents[i].laundry?.phone,
                documents[i].laundry?._id.toString()
              ),
              new User(
                documents[i].user?.email,
                '',
                documents[i].user?.role,
                documents[i].user?._id.toString()
              )
            )
          );
        }
      }
      return clients;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
