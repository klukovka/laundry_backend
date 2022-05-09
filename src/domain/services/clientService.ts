import Roles from '../../controllers/utils/roles';
import { Client } from '../models/client';
import { PagedModel } from '../models/pagedModel';
import { User } from '../models/user';
import { ClientRepository } from '../repositories/clientRepository';

export class ClientService {
  private _clientRepository: ClientRepository;

  constructor(clientRepository: ClientRepository) {
    this._clientRepository = clientRepository;
  }

  async getClients(query: any): Promise<PagedModel<Client>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements = await this._clientRepository.getClientsAmount();
      const content = await this._clientRepository.getClients(page, size);
      return new PagedModel<Client>(
        page,
        size,
        Math.ceil(totalElements / size),
        totalElements,
        content
      );
    } catch (error) {
      throw error;
    }
  }

  async getClientByUserId(userId: string): Promise<Client | null> {
    try {
      return await this._clientRepository.getClientByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async updateClient(client: any): Promise<void> {
    try {
      this._clientRepository.updateClient(
        new Client(
          client.name,
          client.phone,
          client.userData.userId,
          0,
          0,
          client.userData.id,
          new User(client.email, Roles.CLIENT)
        )
      );
    } catch (error) {
      throw error;
    }
  }
}
