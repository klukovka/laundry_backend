import { Laundry } from '../models/laundry';

export interface LaundryRepository {
  create(laundry: Laundry): Promise<void>;
  update(laundryId: string, options: Map<string, any>): Promise<void>;
  delete(laundryId: string): Promise<void>;
  get(laundryId: string): Promise<Laundry | null>;
  getAll(): Promise<Array<Laundry>>;
}
