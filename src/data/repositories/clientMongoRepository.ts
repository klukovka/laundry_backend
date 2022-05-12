import { Client } from '../../domain/models/client';
import { User } from '../../domain/models/user';
import { ClientRepository } from '../../domain/repositories/clientRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class ClientMongoRepository implements ClientRepository {
  async getClientById(clientId: string): Promise<Client | null> {
    try {
      return this._getClient(await DatabaseMongo.getDB.getClientById(clientId));
    } catch (error) {
      throw error;
    }
  }
  async getClientsAmount(): Promise<number> {
    try {
      return await DatabaseMongo.getDB.getClientsAmount();
    } catch (error) {
      throw error;
    }
  }
  async getClients(page: number, size: number): Promise<Client[]> {
    try {
      const clients = await DatabaseMongo.getDB.getClients(page, size);
      const parsedParsed = new Array<Client>();
      if (clients) {
        for (let i = 0; i < clients.length; i++) {
          parsedParsed.push(this._getClient(clients[i])!);
        }
      }
      return parsedParsed;
    } catch (error) {
      throw error;
    }
  }
  async updateClient(client: Client): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateClient(
        client.clientId!,
        {
          email: client.user?.email,
          userId: client.userId,
        },
        {
          name: client.name,
          phone: client.phone,
        }
      );
    } catch (error) {
      throw error;
    }
  }
  async getClientByUserId(userId: string): Promise<Client | null> {
    try {
      const user = await DatabaseMongo.getDB.getClientByUserId(userId);
      return this._getClient(user);
    } catch (error) {
      throw error;
    }
  }

  private _getClient(client: any): Client | null {
    if (!client) {
      return null;
    }
    return new Client(
      client?.name,
      client?.phone,
      client?.user?._id.toString(),
      client?.bonuses,
      client?.sale,
      client?._id.toString(),
      new User(
        client?.user?.email,
        client?.user?.role,
        null,
        client?.user?._id.toString()
      )
    );
  }
}
