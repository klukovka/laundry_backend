import { Mappers } from '../../features/utils/mappers';
import { Laundry } from '../models/laundry';
import { LaundryRepository } from '../repositories/laundryRepository';

export class LaundryService {
  private _repository: LaundryRepository;

  constructor(repository: LaundryRepository) {
    this._repository = repository;
  }

  async create(laundry: Laundry): Promise<void> {
    try {
      return await this._repository.create(laundry);
    } catch (error) {
      throw error;
    }
  }

  async update(
    laundryId: string,
    options: [{ propName: string; value: any }]
  ): Promise<void> {
    try {
      return await this._repository.update(
        laundryId,
        Mappers.mapRequestParamsToMap(options)
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(laundryId: string): Promise<void> {
    try {
      return await this._repository.delete(laundryId);
    } catch (error) {
      throw error;
    }
  }

  async getById(laundryId: string): Promise<Laundry | null> {
    try {
      return await this._repository.get(laundryId);
    } catch (error) {
      throw error;
    }
  }
  async getAll(): Promise<Laundry[]> {
    try {
      return await this._repository.getAll();
    } catch (error) {
      throw error;
    }
  }
}
