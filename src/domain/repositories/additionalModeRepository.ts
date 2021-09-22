import { AdditionalMode } from '../models/additionalMode';

export interface AdditionalModeRepository {
  create(additionalMode: AdditionalMode): Promise<void>;
  update(idAdditionalMode: string, options: Map<string, any>): Promise<void>;
  delete(idAdditionalMode: string): Promise<void>;
  get(idAdditionalMode: string): Promise<AdditionalMode | null>;
  getAll(): Promise<Array<AdditionalMode>>;
}
