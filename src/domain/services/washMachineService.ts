import { Mappers } from '../../features/utils/mappers';
import { WashMachine } from '../models/washMachine';
import { WashMachineRepository } from '../repositories/washMachineRepository';

export class WashMachineService {
  private _repository: WashMachineRepository;

  constructor(repository: WashMachineRepository) {
    this._repository = repository;
  }

  async create(washMachine: WashMachine): Promise<void> {
    try {
      return await this._repository.create(washMachine);
    } catch (error) {
      throw error;
    }
  }

  async update(
    washMachineId: string,
    options: [{ propName: string; value: any }]
  ): Promise<void> {
    try {
      return await this._repository.update(
        washMachineId,
        Mappers.mapRequestParamsToMap(options)
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(washMachineId: string): Promise<void> {
    try {
      return await this._repository.delete(washMachineId);
    } catch (error) {
      throw error;
    }
  }

  async get(washMachineId: string): Promise<WashMachine | null> {
    try {
      return await this._repository.get(washMachineId);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Array<WashMachine>> {
    try {
      return await this._repository.getAll();
    } catch (error) {
      throw error;
    }
  }

  async getWithLaundry(washMachineId: string): Promise<WashMachine | null> {
    try {
      return await this._repository.getWithLaundry(washMachineId);
    } catch (error) {
      throw error;
    }
  }

  async getAllWithLaundry(): Promise<Array<WashMachine>> {
    try {
      return await this._repository.getAllWithLaundry();
    } catch (error) {
      throw error;
    }
  }
}
