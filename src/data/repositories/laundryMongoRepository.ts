import { AdditionalMode } from '../../domain/models/additionalMode';
import { Employee } from '../../domain/models/employee';
import { Laundry } from '../../domain/models/laundry';
import { Mode } from '../../domain/models/mode';
import { User } from '../../domain/models/user';
import { WashMachine } from '../../domain/models/washMachine';
import { LaundryRepository } from '../../domain/repositories/laundryRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class LaundryMongoRepository implements LaundryRepository {
  async getEmployees(
    laundryId: string,
    page: number,
    size: number
  ): Promise<Employee[]> {
    try {
      const employees = await DatabaseMongo.getDB.getEmployees(
        laundryId,
        page,
        size
      );
      const parsedEmployees = new Array<Employee>();
      if (employees) {
        for (const employee in employees) {
          parsedEmployees.push(this._getEmployee(employee));
        }
      }
      return parsedEmployees;
    } catch (error) {
      throw error;
    }
  }

  async getEmployeesAmount(laundryId: string): Promise<number> {
    try {
      return await DatabaseMongo.getDB.getEmployeesAmount(laundryId);
    } catch (error) {
      throw error;
    }
  }

  async createWashMachine(washMachine: WashMachine): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createWashMachine(washMachine);
    } catch (error) {
      throw error;
    }
  }

  async updateWashMachine(washMachine: WashMachine): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateWashMachine(washMachine);
    } catch (error) {
      throw error;
    }
  }

  async deleteWashMachine(washMachineId: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteWashMachine(washMachineId);
    } catch (error) {
      throw error;
    }
  }

  async getWashMachineById(washMachineId: string): Promise<WashMachine | null> {
    try {
      return await DatabaseMongo.getDB.getWashMachineById(washMachineId);
    } catch (error) {
      throw error;
    }
  }

  async getWashMachines(
    laundryId: string,
    page: number,
    size: number
  ): Promise<WashMachine[]> {
    try {
      const washMachines = await DatabaseMongo.getDB.getWashMachines(
        laundryId,
        page,
        size
      );
      const parsedWashMachines = new Array<WashMachine>();
      if (washMachines) {
        for (const washMachine in washMachines) {
          parsedWashMachines.push(this._getWashMachine(washMachine));
        }
      }
      return parsedWashMachines;
    } catch (error) {
      throw error;
    }
  }

  async getWashMachinesAmount(laundryId: string): Promise<number> {
    try {
      return await DatabaseMongo.getDB.getWashMachinesAmount(laundryId);
    } catch (error) {
      throw error;
    }
  }

  async createAdditionalMode(additionalMode: AdditionalMode): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createAdditionalMode(additionalMode);
    } catch (error) {
      throw error;
    }
  }

  async updateAdditionalMode(additionalMode: AdditionalMode): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateAdditionalMode(additionalMode);
    } catch (error) {
      throw error;
    }
  }

  async deleteAdditionalMode(additionalModeId: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteAdditionalMode(additionalModeId);
    } catch (error) {
      throw error;
    }
  }

  async getAdditionalModeById(
    additionalModeId: string
  ): Promise<AdditionalMode | null> {
    try {
      const additionalMode = await DatabaseMongo.getDB.getAdditionalMode(
        additionalModeId
      );
      return this._getAdditionalMode(additionalMode);
    } catch (error) {
      throw error;
    }
  }

  async getAdditionalModes(
    laundryId: string,
    page: number,
    size: number
  ): Promise<AdditionalMode[]> {
    try {
      const additionalModes = await DatabaseMongo.getDB.getAdditionalModes(
        laundryId,
        page,
        size
      );
      const parsedAdditionalModes = new Array<AdditionalMode>();
      if (additionalModes) {
        for (const additionalMode in additionalModes) {
          parsedAdditionalModes.push(this._getAdditionalMode(additionalMode));
        }
      }
      return parsedAdditionalModes;
    } catch (error) {
      throw error;
    }
  }

  async getAdditionalModesAmount(laundryId: string): Promise<number> {
    try {
      return await DatabaseMongo.getDB.getAdditionalModesAmount(laundryId);
    } catch (error) {
      throw error;
    }
  }

  async createMode(mode: Mode): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createMode(mode);
    } catch (error) {
      throw error;
    }
  }

  async updateMode(mode: Mode): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateMode(mode);
    } catch (error) {
      throw error;
    }
  }

  async deleteMode(modeId: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteMode(modeId);
    } catch (error) {
      throw error;
    }
  }

  async getModeById(modeId: string): Promise<Mode | null> {
    try {
      const mode = await DatabaseMongo.getDB.getMode(modeId);
      return this._getMode(mode);
    } catch (error) {
      throw error;
    }
  }

  async getModes(
    laundryId: string,
    page: number,
    size: number
  ): Promise<Mode[]> {
    try {
      const modes = await DatabaseMongo.getDB.getModes(laundryId, page, size);
      const parsedModes = new Array<Mode>();
      if (modes) {
        for (const mode in modes) {
          parsedModes.push(this._getMode(mode));
        }
      }
      return parsedModes;
    } catch (error) {
      throw error;
    }
  }

  async getModesAmount(laundryId: string): Promise<number> {
    try {
      return await DatabaseMongo.getDB.getModesAmount(laundryId);
    } catch (error) {
      throw error;
    }
  }

  async updateLaundry(laundry: Laundry): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateLaundry(laundry.laundryId!, {
        userId: laundry.userId,
        email: laundry.user?.email,
        name: laundry.name,
        address: laundry.address,
        phone: laundry.phone,
        maxAmount: laundry.maxAmount,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateEmployee(employee: Employee): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateEmployee(employee.employeeId!, {
        userId: employee.userId,
        email: employee.user?.email,
        name: employee.name,
        phone: employee.phone,
        birthday: employee.birthday,
      });
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeById(employeeId: string): Promise<Employee | null> {
    try {
      const user = await DatabaseMongo.getDB.getEmployee(employeeId);
      return this._getEmployeeWithLaundry(user);
    } catch (error) {
      throw error;
    }
  }

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
      return this._getEmployeeWithLaundry(user);
    } catch (error) {
      throw error;
    }
  }

  private _getAdditionalMode(additionalMode: any): AdditionalMode | null {
    if (!additionalMode) {
      return null;
    }

    return new AdditionalMode(
      additionalMode?.name,
      additionalMode?.time,
      additionalMode?.costs,
      additionalMode?.laundry?._id.toString(),
      additionalMode?._id.toString()
    );
  }

  private _getMode(mode: any): Mode | null {
    if (!mode) {
      return null;
    }

    return new Mode(
      mode?.name,
      mode?.time,
      mode?.costs,
      mode?.laundry?._id.toString(),
      mode?._id.toString()
    );
  }

  private _getWashMachine(washMachine: any): WashMachine | null {
    if (!washMachine) {
      return null;
    }

    return new WashMachine(
      washMachine?.model,
      washMachine?.manufacturer,
      washMachine?.capacity,
      washMachine?.powerUsage,
      washMachine?.spinningSpeed,
      washMachine?.laundry?._id.toString(),
      washMachine?.maxTime,
      washMachine?.currentTime,
      washMachine?.isWorking,
      washMachine?.isWashing,
      washMachine?._id.toString()
    );
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
      null,
      new User(
        employee?.user?.email,
        employee?.user?.role,
        null,
        employee?.user?._id.toString()
      )
    );
  }

  private _getEmployeeWithLaundry(employee: any): Employee | null {
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
