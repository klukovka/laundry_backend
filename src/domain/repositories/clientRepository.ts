import { Client } from '../models/client';

export interface ClientRepository {
  getClientByUserId(userId: string): Promise<Client | null>;
  getClients(page: number, size: number): Promise<Client[]>;
  getClientsAmount(): Promise<number>;
  updateClient(client: Client): Promise<void>;
}
