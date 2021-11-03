import { Event } from '../models/event';
import { EventRepository } from '../repositories/eventRepository';

export class EventService {
  private _repository: EventRepository;

  constructor(repository: EventRepository) {
    this._repository = repository;
  }

  async create(event: Event): Promise<string> {
    try {
      return await this._repository.create(event);
    } catch (error) {
      throw error;
    }
  }

  async paidForEvent(eventId: string, clientId: string, bonuses: number = 0) {
    try {
      let options = new Map<string, any>();
      options.set('client', clientId);
      options.set('paidBonuses', bonuses);
      options.set('timeBegin', Date.now());
      options.set('paidStatus', true);

      return await this._repository.update(eventId, options);
    } catch (error) {
      throw error;
    }
  }

  async takeEvent(eventId: string) {
    try {
      let options = new Map<string, any>();
      options.set('taken', true);
      return await this._repository.update(eventId, options);
    } catch (error) {
      throw error;
    }
  }

  async rateEvent(eventId: string, rating: number) {
    try {
      let options = new Map<string, any>();
      options.set('rating', rating);
      return await this._repository.update(eventId, options);
    } catch (error) {
      throw error;
    }
  }

  async delete(eventId: string): Promise<void> {
    try {
      return await this._repository.delete(eventId);
    } catch (error) {
      throw error;
    }
  }

  async get(eventId: string): Promise<Event | null> {
    try {
      return await this._repository.get(eventId);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Array<Event>> {
    try {
      return await this._repository.getAll();
    } catch (error) {
      throw error;
    }
  }

  async getWithInfo(eventId: string): Promise<Event | null> {
    try {
      return await this._repository.getWithInfo(eventId);
    } catch (error) {
      throw error;
    }
  }

  async getAllWithInfo(): Promise<Array<Event>> {
    try {
      return await this._repository.getAllWithInfo();
    } catch (error) {
      throw error;
    }
  }
}
