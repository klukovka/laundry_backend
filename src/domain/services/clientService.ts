import { Mappers } from '../../features/utils/mappers';
import { Client } from '../models/client';
import { ClientRepository } from '../repositories/clientRepository';

export class ClientService {
  private _repository: ClientRepository;

  constructor(repository: ClientRepository) {
    this._repository = repository;
  }

  async create(client: Client): Promise<void> {
    try {
      return await this._repository.create(client);
    } catch (error) {
      throw error;
    }
  }

  async update(
    clientId: string,
    options: [{ propName: string; value: any }]
  ): Promise<void> {
    try {
      return await this._repository.update(
        clientId,
        Mappers.mapRequestParamsToMap(options)
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(clientId: string): Promise<void> {
    try {
      return await this._repository.delete(clientId);
    } catch (error) {
      throw error;
    }
  }

  async get(clientId: string): Promise<Client | null> {
    try {
      return await this._repository.get(clientId);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Array<Client>> {
    try {
      return await this._repository.getAll();
    } catch (error) {
      throw error;
    }
  }

  async getWithInfo(clientId: string): Promise<Client | null> {
    try {
      return await this._repository.getWithInfo(clientId);
    } catch (error) {
      throw error;
    }
  }

  async getAllWithInfo(): Promise<Array<Client>> {
    try {
      return await this._repository.getAllWithInfo();
    } catch (error) {
      throw error;
    }
  }
}
