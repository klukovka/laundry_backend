import { Event } from '../models/event';

export interface EventRepository {
  create(event: Event): Promise<void>;
  update(eventId: string, options: Map<string, any>): Promise<void>;
  delete(eventId: string): Promise<void>;
  get(eventId: string): Promise<Event | null>;
  getAll(): Promise<Array<Event>>;
  getWithInfo(eventId: string): Promise<Event | null>;
  getAllWithInfo(): Promise<Array<Event>>;
}
