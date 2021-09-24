import { Mappers } from '../../features/utils/mappers';
import { Mode } from '../models/Mode';
import { ModeRepository } from '../repositories/ModeRepository';

export class ModeService {
  private _repository: ModeRepository;

  constructor(repository: ModeRepository) {
    this._repository = repository;
  }

  async create(mode: Mode): Promise<void> {
    try {
      return await this._repository.create(mode);
    } catch (error) {
      throw error;
    }
  }

  async update(
    modeId: string,
    options: [{ propName: string; value: any }]
  ): Promise<void> {
    try {
      return await this._repository.update(
        modeId,
        Mappers.mapRequestParamsToMap(options)
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(modeId: string): Promise<void> {
    try {
      return await this._repository.delete(modeId);
    } catch (error) {
      throw error;
    }
  }

  async getById(modeId: string): Promise<Mode | null> {
    try {
      return await this._repository.get(modeId);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Mode[]> {
    try {
      return await this._repository.getAll();
    } catch (error) {
      throw error;
    }
  }
}
