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

  async update(idLaundry: string, options: Map<string, any>): Promise<void> {
    try {
      return await this._repository.update(idLaundry, options);
    } catch (error) {
      throw error;
    }
  }

  async delete(idLaundry: string): Promise<void> {
    try {
      return await this._repository.delete(idLaundry);
    } catch (error) {
      throw error;
    }
  }

  async getById(idLaundry: string): Promise<Laundry | null> {
    try {
      return await this._repository.get(idLaundry);
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
