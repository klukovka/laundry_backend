import { Laundry } from '../models/laundry';

export interface LaundryRepository {
  create(laundry: Laundry): Promise<void>;
  update(idLaundry: string, options: Map<string, any>): Promise<void>;
  delete(idLaundry: string): Promise<void>;
  getLaundry(idLaundry: string): Promise<Laundry | null>;
}
