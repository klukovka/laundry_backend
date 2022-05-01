import { Laundry } from '../models/laundry';

export interface LaundryRepository {
  getLaundryId(userId: string): Promise<Laundry | null>;
}
