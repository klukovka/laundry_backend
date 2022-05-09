import { LaundryRepository } from '../repositories/laundryRepository';
import { PagedModel } from '../models/pagedModel';
import { Laundry } from '../models/laundry';
import { User } from '../models/user';
import Roles from '../../controllers/utils/roles';
import { Employee } from '../models/employee';
import { WashMachine } from '../models/washMachine';
import { AdditionalMode } from '../models/additionalMode';
import { Mode } from '../models/mode';

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

  async getAllEmployees(query: any): Promise<PagedModel<Employee>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements =
        await this._laundryRepository.getAllEmployeesAmount();
      const content = await this._laundryRepository.getAllEmployees(page, size);
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

  async createWashMachine(
    laundryId: string,
    washMachine: any
  ): Promise<string | null> {
    try {
      const washMachinesAmount =
        await this._laundryRepository.getWashMachinesAmount(laundryId);
      const laundry = await this._laundryRepository.getLaundryById(laundryId);
      if ((laundry?.maxAmount ?? 0) < washMachinesAmount) {
        throw new Error(
          "You can't create new wash mashine because you achive max amount"
        );
      } else {
        return await this._laundryRepository.createWashMachine(
          new WashMachine(
            washMachine.model,
            washMachine.manufacturer,
            washMachine.capacity,
            washMachine.powerUsage,
            washMachine.spinningSpeed,
            laundryId,
            washMachine.maxTime
          )
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async updateWashMachine(
    washMachineId: string,
    washMachine: any
  ): Promise<void> {
    try {
      const washMachineDB = await this._laundryRepository.getWashMachineById(
        washMachineId
      );
      if (washMachineDB == null) {
        throw new Error("Wash Machine doesn't exist");
      }
      if (washMachineDB!.isWashing) {
        throw new Error("You can't update wash machine while it is washing");
      }
      if (washMachineDB!.currentTime > washMachine.maxTime) {
        washMachineDB!.isWorking = false;
      } else {
        washMachineDB!.isWorking = true;
      }
      await this._laundryRepository.updateWashMachine(
        new WashMachine(
          washMachine.model,
          washMachine.manufacturer,
          washMachine.capacity,
          washMachine.powerUsage,
          washMachine.spinningSpeed,
          '',
          washMachine.maxTime,
          washMachineDB!.currentTime,
          washMachineDB!.isWorking,
          washMachineDB!.isWashing,
          washMachineId
        )
      );
      return;
    } catch (error) {
      throw error;
    }
  }

  async deleteWashMachine(washMachineId: string): Promise<void> {
    try {
      await this._laundryRepository.deleteWashMachine(washMachineId);
    } catch (error) {
      throw error;
    }
  }

  async getLaundryWashMachines(
    laundryId: string,
    query: any
  ): Promise<PagedModel<WashMachine>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements = await this._laundryRepository.getWashMachinesAmount(
        laundryId
      );
      console.log(totalElements);
      const content = await this._laundryRepository.getWashMachines(
        laundryId,
        page,
        size
      );
      console.log(content);

      return new PagedModel<WashMachine>(
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

  async createAdditionalMode(
    laundryId: string,
    additionalMode: any
  ): Promise<string | null> {
    try {
      return await this._laundryRepository.createAdditionalMode(
        new AdditionalMode(
          additionalMode.name,
          additionalMode.time,
          additionalMode.costs,
          laundryId
        )
      );
    } catch (error) {
      throw error;
    }
  }

  async updateAdditionalMode(additionalMode: any): Promise<void> {
    try {
      await this._laundryRepository.updateAdditionalMode(
        new AdditionalMode(
          additionalMode.name,
          additionalMode.time,
          additionalMode.costs,
          '',
          additionalMode.additionalModeId
        )
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteAdditionalMode(additionalModeId: string): Promise<void> {
    try {
      await this._laundryRepository.deleteAdditionalMode(additionalModeId);
    } catch (error) {
      throw error;
    }
  }

  async getAdditionalModes(
    laundryId: string
  ): Promise<PagedModel<AdditionalMode>> {
    try {
      const totalElements =
        await this._laundryRepository.getAdditionalModesAmount(laundryId);
      const content = await this._laundryRepository.getAdditionalModes(
        laundryId
      );

      return new PagedModel<AdditionalMode>(
        0,
        totalElements,
        1,
        totalElements,
        content
      );
    } catch (error) {
      throw error;
    }
  }

  async createMode(laundryId: string, mode: any): Promise<string | null> {
    try {
      return await this._laundryRepository.createMode(
        new Mode(mode.name, mode.time, mode.costs, laundryId)
      );
    } catch (error) {
      throw error;
    }
  }

  async updateMode(mode: any): Promise<void> {
    try {
      await this._laundryRepository.updateMode(
        new Mode(mode.name, mode.time, mode.costs, '', mode.modeId)
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteMode(modeId: string): Promise<void> {
    try {
      await this._laundryRepository.deleteMode(modeId);
    } catch (error) {
      throw error;
    }
  }

  async getModes(laundryId: string): Promise<PagedModel<Mode>> {
    try {
      const totalElements = await this._laundryRepository.getModesAmount(
        laundryId
      );
      const content = await this._laundryRepository.getModes(laundryId);

      return new PagedModel<Mode>(0, totalElements, 1, totalElements, content);
    } catch (error) {
      throw error;
    }
  }
}
