import { Employee } from '../models/employee';
import { Laundry } from '../models/laundry';
import { WashMachine } from '../models/washMachine';
import { AdditionalMode } from '../models/additionalMode';
import { Mode } from '../models/mode';

export interface LaundryRepository {
  getLaundryByUserId(userId: string): Promise<Laundry | null>;
  updateLaundry(laundry: Laundry): Promise<void>;
  getLaundries(page: number, size: number): Promise<Laundry[]>;
  getLaundriesAmount(): Promise<number>;

  getEmployeeByUserId(userId: string): Promise<Employee | null>;
  updateEmployee(employee: Employee): Promise<void>;
  getEmployeeById(employee: string): Promise<Employee | null>;
  getEmployees(
    laundryId: string,
    page: number,
    size: number
  ): Promise<Employee[]>;
  getEmployeesAmount(laundryId: string): Promise<number>;

  createWashMachine(washMachine: WashMachine): Promise<string | null>;
  updateWashMachine(washMachine: WashMachine): Promise<void>;
  deleteWashMachine(washMachineId: string): Promise<void>;
  getWashMachineById(washMachineId: string): Promise<WashMachine | null>;
  getWashMachines(
    laundryId: string,
    page: number,
    size: number
  ): Promise<WashMachine[]>;
  getWashMachinesAmount(laundryId: string): Promise<number>;

  createAdditionalMode(additionalMode: AdditionalMode): Promise<string | null>;
  updateAdditionalMode(additionalMode: AdditionalMode): Promise<void>;
  deleteAdditionalMode(additionalModeId: string): Promise<void>;
  getAdditionalModeById(
    additionalModeId: string
  ): Promise<AdditionalMode | null>;
  getAdditionalModes(
    laundryId: string,
    page: number,
    size: number
  ): Promise<AdditionalMode[]>;
  getAdditionalModesAmount(laundryId: string): Promise<number>;

  createMode(mode: Mode): Promise<string | null>;
  updateMode(mode: Mode): Promise<void>;
  deleteMode(modeId: string): Promise<void>;
  getModeById(modeId: string): Promise<Mode | null>;
  getModes(laundryId: string, page: number, size: number): Promise<Mode[]>;
  getModesAmount(laundryId: string): Promise<number>;
}
