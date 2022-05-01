import { Client } from '../../domain/models/client';
import { User } from '../../domain/models/user';
import { ClientRepository } from '../../domain/repositories/clientRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class ClientMongoRepository implements ClientRepository {
  async create(client: Client): Promise<String> {
    try {
      return await DatabaseMongo.getDB.createClient(client);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async update(clientId: string, options: Map<string, any>): Promise<void> {
    try {
      const objectOptions = {
        name: options.get('name'),
        surname: options.get('surname'),
        phone: options.get('phone'),
        bonuses: options.get('bonuses'),
        user: options.get('user'),
      };

      await DatabaseMongo.getDB.updateClient(clientId, objectOptions);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(clientId: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteClient(clientId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getByUser(userId: string): Promise<Client | null> {
    try {
      const client = await DatabaseMongo.getDB.getClientByUserId(userId);
      console.log(client);
      if (client) {
        return new Client(
          client.name,
          client.surname,
          client.phone,
          client.user?._id.toString(),
          client.bonuses,
          client?._id.toString()
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async get(clientId: string): Promise<Client | null> {
    try {
      const client = await DatabaseMongo.getDB.getClient(clientId);
      if (client) {
        return new Client(
          client.name,
          client.surname,
          client.phone,
          client.user?._id.toString(),
          client.bonuses,
          client?._id.toString()
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAll(): Promise<Client[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllClients();
      let clients = new Array<Client>();

      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          clients.push(
            new Client(
              documents[i].name,
              documents[i].surname,
              documents[i].phone,
              documents[i].user?._id.toString(),
              documents[i].bonuses,
              documents[i]?._id.toString()
            )
          );
        }
      }

      return clients;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getWithInfo(clientId: string): Promise<Client | null> {
    try {
      const client = await DatabaseMongo.getDB.getClientWithInfo(clientId);
      if (client) {
        return new Client(
          client.name,
          client.surname,
          client.phone,
          client.user?._id.toString(),
          client.bonuses,
          client?._id.toString(),
          new User(
            client.user?.email,
            '',
            client.user?.role,
            client.user?._id.toString()
          )
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllWithInfo(): Promise<Client[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllClientsWithInfo();
      let clients = new Array<Client>();

      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          clients.push(
            new Client(
              documents[i].name,
              documents[i].surname,
              documents[i].phone,
              documents[i].user?._id.toString(),
              documents[i].bonuses,
              documents[i]?._id.toString(),
              new User(
                documents[i].user?.email,
                '',
                documents[i].user?.role,
                documents[i].user?._id.toString()
              )
            )
          );
        }
      }

      return clients;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
