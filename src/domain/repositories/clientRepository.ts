import { Client } from '../models/client';

export interface ClientRepository {
  getClientId(userId: string): Promise<Client | null>;
}
