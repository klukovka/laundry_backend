import { AdditionalMode } from '../models/additionalMode';

export interface AdditionalModeRepository {
  create(additionalMode: AdditionalMode): Promise<void>;
  update(additionalModeId: string, options: Map<string, any>): Promise<void>;
  delete(additionalModeId: string): Promise<void>;
  get(additionalModeId: string): Promise<AdditionalMode | null>;
  getAll(): Promise<Array<AdditionalMode>>;
}
