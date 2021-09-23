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
    idWashMachine: string,
    options: [{ propName: string; value: any }]
  ): Promise<void> {
    try {
      return await this._repository.update(
        idWashMachine,
        Mappers.mapRequestParamsToMap(options)
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(idWashMachine: string): Promise<void> {
    try {
      return await this._repository.delete(idWashMachine);
    } catch (error) {
      throw error;
    }
  }

  async get(idWashMachine: string): Promise<WashMachine | null> {
    try {
      return await this._repository.get(idWashMachine);
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

  async getWithLaundry(idWashMachine: string): Promise<WashMachine | null> {
    try {
      return await this._repository.getWithLaundry(idWashMachine);
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
