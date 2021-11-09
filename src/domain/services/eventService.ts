import { Event } from '../models/event';
import { EventRepository } from '../repositories/eventRepository';
import { ClientRepository } from '../repositories/clientRepository';

export class EventService {
  private _eventRepository: EventRepository;
  private _clientRepository: ClientRepository;

  constructor(
    eventRepository: EventRepository,
    clientRepository: ClientRepository
  ) {
    this._eventRepository = eventRepository;
    this._clientRepository = clientRepository;
  }

  async create(event: Event): Promise<string> {
    try {
      return await this._eventRepository.create(event);
    } catch (error) {
      throw error;
    }
  }

  async paidForEvent(eventId: string, clientId: string, bonuses: number = 0) {
    try {
      const persent = 0.1;
      let options = new Map<string, any>();
      options.set('client', clientId);
      options.set('paidBonuses', bonuses);
      options.set('timeBegin', Date.now());
      options.set('paidStatus', true);
      const event = await this.getWithInfo(eventId);
      const payment =
        (event?.mode?.costs ?? 0) + (event?.additionalMode?.costs ?? 0);
      let clientBonuses =
        (await this._clientRepository.get(clientId))?.bonuses ?? 0;
      console.log(clientBonuses);
      clientBonuses -= bonuses;
      console.log(clientBonuses);
      clientBonuses += (payment - bonuses) * persent;
      console.log(clientBonuses);

      await this._clientRepository.update(
        clientId,
        new Map([['bonuses', clientBonuses]])
      );
      return await this._eventRepository.update(eventId, options);
    } catch (error) {
      throw error;
    }
  }

  async takeEvent(eventId: string) {
    try {
      let options = new Map<string, any>();
      options.set('taken', true);
      return await this._eventRepository.update(eventId, options);
    } catch (error) {
      throw error;
    }
  }

  async rateEvent(eventId: string, rating: number) {
    try {
      let options = new Map<string, any>();
      options.set('rating', rating);
      return await this._eventRepository.update(eventId, options);
    } catch (error) {
      throw error;
    }
  }

  async delete(eventId: string): Promise<void> {
    try {
      return await this._eventRepository.delete(eventId);
    } catch (error) {
      throw error;
    }
  }

  async get(eventId: string): Promise<Event | null> {
    try {
      return await this._eventRepository.get(eventId);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Array<Event>> {
    try {
      return await this._eventRepository.getAll();
    } catch (error) {
      throw error;
    }
  }

  async getWithInfo(eventId: string): Promise<Event | null> {
    try {
      return await this._eventRepository.getWithInfo(eventId);
    } catch (error) {
      throw error;
    }
  }

  async getAllWithInfo(): Promise<Array<Event>> {
    try {
      return await this._eventRepository.getAllWithInfo();
    } catch (error) {
      throw error;
    }
  }
}
