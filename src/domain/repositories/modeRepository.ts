import { Mode } from '../models/mode';

export interface ModeRepository {
  create(mode: Mode): Promise<void>;
  update(idMode: string, options: Map<string, any>): Promise<void>;
  delete(idMode: string): Promise<void>;
  get(idMode: string): Promise<Mode | null>;
  getAll(): Promise<Array<Mode>>;
}
