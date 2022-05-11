import { Client } from '../models/client';
import { Event } from '../models/event';

export interface EventRepository {
  createEvent(event: Event): Promise<string>;
  getEvent(eventId: string): Promise<Event | null>;
  deleteEvent(eventId: string): Promise<void>;
  updateEvent(eventId: string, options: any): Promise<void>;
  updateWashMachine(washMachineId: string, options: any): Promise<void>;
  updateClient(clientId: string, options: any): Promise<void>;

  getClientEvents(
    clientId: string,
    page: number,
    size: number
  ): Promise<Event[]>;
  getClientEventsAmount(clientId: string): Promise<number>;

  getLaundryEvents(
    laundryId: string,
    page: number,
    size: number
  ): Promise<Event[]>;
  getLaundryEventsAmount(laundryId: string): Promise<number>;

  getWashMachineEvents(
    washMachineId: string,
    page: number,
    size: number
  ): Promise<Event[]>;
  getWashMachineEventsAmount(washMachineId: string): Promise<number>;
}
