import { Mappers } from '../../features/utils/mappers';
import { AdditionalMode } from '../models/additionalMode';
import { AdditionalModeRepository } from '../repositories/additionalModeRepository';

export class AdditionalModeService {
  private _repository: AdditionalModeRepository;

  constructor(repository: AdditionalModeRepository) {
    this._repository = repository;
  }

  async create(additionalMode: AdditionalMode): Promise<void> {
    try {
      return await this._repository.create(additionalMode);
    } catch (error) {
      throw error;
    }
  }

  async update(
    idAdditionalMode: string,
    options: [{ propName: string; value: any }]
  ): Promise<void> {
    try {
      return await this._repository.update(
        idAdditionalMode,
        Mappers.mapRequestParamsToMap(options)
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(idAdditionalMode: string): Promise<void> {
    try {
      return await this._repository.delete(idAdditionalMode);
    } catch (error) {
      throw error;
    }
  }

  async getById(idAdditionalMode: string): Promise<AdditionalMode | null> {
    try {
      return await this._repository.get(idAdditionalMode);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<AdditionalMode[]> {
    try {
      return await this._repository.getAll();
    } catch (error) {
      throw error;
    }
  }
}