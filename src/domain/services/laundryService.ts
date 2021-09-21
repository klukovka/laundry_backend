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
}
