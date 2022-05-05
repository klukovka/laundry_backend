import { LaundryRepository } from '../repositories/laundryRepository';
import { PagedModel } from '../models/pagedModel';
import { Laundry } from '../models/laundry';
import { User } from '../models/user';
import Roles from '../../controllers/utils/roles';
import { Employee } from '../models/employee';

export class LaundryService {
  private _laundryRepository: LaundryRepository;

  constructor(laundryRepository: LaundryRepository) {
    this._laundryRepository = laundryRepository;
  }

  async getLaundries(query: any): Promise<PagedModel<Laundry>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements = await this._laundryRepository.getLaundriesAmount();
      const content = await this._laundryRepository.getLaundries(page, size);
      return new PagedModel<Laundry>(
        page,
        size,
        Math.ceil(totalElements / size),
        totalElements,
        content
      );
    } catch (error) {
      throw error;
    }
  }

  async updateLaundry(laundry: any): Promise<void> {
    try {
      const totalWashMachines =
        await this._laundryRepository.getWashMachinesAmount(
          laundry.userData.id
        );
      if (totalWashMachines < laundry.maxAmount) {
        await this._laundryRepository.updateLaundry(
          new Laundry(
            laundry.name,
            laundry.address,
            laundry.phone,
            laundry.maxAmount,
            laundry.userData.userId,
            laundry.userData.id,
            new User(laundry.email, Roles.LAUNDRY)
          )
        );
      } else {
        throw new Error(
          'Max amount of washing machines should be bigger than current amount'
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async getLaundryByUserId(userId: string): Promise<Laundry | null> {
    try {
      return await this._laundryRepository.getLaundryByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeByUserId(userId: string): Promise<Employee | null> {
    try {
      return await this._laundryRepository.getEmployeeByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async updateEmployee(employee: any): Promise<void> {
    await this._laundryRepository.updateEmployee(
      new Employee(
        employee.name,
        employee.phone,
        employee.birthday,
        '',
        employee.userData.userId,
        employee.userData.id,
        null,
        new User(employee.userData.email, Roles.EMPLOYEE)
      )
    );
    try {
    } catch (error) {
      throw error;
    }
  }

  async getLaundryEmployees(
    laundryId: string,
    query: any
  ): Promise<PagedModel<Employee>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements = await this._laundryRepository.getEmployeesAmount(
        laundryId
      );
      const content = await this._laundryRepository.getEmployees(
        laundryId,
        page,
        size
      );
      return new PagedModel<Employee>(
        page,
        size,
        Math.ceil(totalElements / size),
        totalElements,
        content
      );
    } catch (error) {
      throw error;
    }
  }
}