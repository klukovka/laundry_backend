import { Client } from '../../domain/models/client';
import { User } from '../../domain/models/user';
import { ClientRepository } from '../../domain/repositories/clientRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class ClientMongoRepository implements ClientRepository {
  async getClientId(userId: string): Promise<Client | null> {
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
