import { Mappers } from '../../features/utils/mappers';
import { Employee } from '../models/employee';
import { EmployeeRepository } from '../repositories/employeeRepository';

export class EmployeeService {
  private _repository: EmployeeRepository;

  constructor(repository: EmployeeRepository) {
    this._repository = repository;
  }

  async create(employee: Employee): Promise<void> {
    try {
      console.log(employee.birthday);
      return await this._repository.create(employee);
    } catch (error) {
      throw error;
    }
  }

  async update(
    employeeId: string,
    options: [{ propName: string; value: any }]
  ): Promise<void> {
    try {
      return await this._repository.update(
        employeeId,
        Mappers.mapRequestParamsToMap(options)
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(employeeId: string): Promise<void> {
    try {
      return await this._repository.delete(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async get(employeeId: string): Promise<Employee | null> {
    try {
      return await this._repository.get(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Array<Employee>> {
    try {
      return await this._repository.getAll();
    } catch (error) {
      throw error;
    }
  }

  async getWithInfo(employeeId: string): Promise<Employee | null> {
    try {
      return await this._repository.getWithInfo(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async getAllWithInfo(): Promise<Array<Employee>> {
    try {
      return await this._repository.getAllWithInfo();
    } catch (error) {
      throw error;
    }
  }
}
