import { Client } from '../models/client';

export interface ClientRepository {
  create(client: Client): Promise<String>;
  update(clientId: string, options: Map<string, any>): Promise<void>;
  delete(clientId: string): Promise<void>;
  get(clientId: string): Promise<Client | null>;
  getByUser(userId: string): Promise<Client | null>;
  getAll(): Promise<Array<Client>>;
  getWithInfo(clientId: string): Promise<Client | null>;
  getAllWithInfo(): Promise<Array<Client>>;
}
