import { Mode } from '../models/mode';

export interface ModeRepository {
  create(mode: Mode): Promise<void>;
  update(modeId: string, options: Map<string, any>): Promise<void>;
  delete(modeId: string): Promise<void>;
  get(modeId: string): Promise<Mode | null>;
  getAll(): Promise<Array<Mode>>;
}
