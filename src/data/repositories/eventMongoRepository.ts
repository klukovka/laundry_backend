import { AdditionalMode } from '../../domain/models/additionalMode';
import { Client } from '../../domain/models/client';
import { Event } from '../../domain/models/event';
import { Mode } from '../../domain/models/mode';
import { EventRepository } from '../../domain/repositories/eventRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class EventMongoRepository implements EventRepository {
  async updateClient(clientId: string, options: any): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateClient(clientId, null, options);
    } catch (error) {
      throw error;
    }
  }
  async createEvent(event: Event): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createEvent(event);
    } catch (error) {
      throw error;
    }
  }
  async getEvent(eventId: string): Promise<Event | null> {
    try {
      return DatabaseMongo.getDB.getEventById(eventId);
    } catch (error) {
      throw error;
    }
  }
  async updateEvent(eventId: string, options: any): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateEventById(eventId, options);
    } catch (error) {
      throw error;
    }
  }
  async updateWashMachine(washMachineId: string, options: any): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateWashMachine(washMachineId, options);
    } catch (error) {
      throw error;
    }
  }

  async getClientEvents(
    clientId: string,
    page: number,
    size: number
  ): Promise<Client[]> {
    throw new Error('Method not implemented.');
    try {
    } catch (error) {
      throw error;
    }
  }
  async getClientEventsAmount(clientId: string): Promise<number> {
    throw new Error('Method not implemented.');
    try {
    } catch (error) {
      throw error;
    }
  }
  async getLaundryEvents(
    laundryId: string,
    page: number,
    size: number
  ): Promise<Client[]> {
    throw new Error('Method not implemented.');
    try {
    } catch (error) {
      throw error;
    }
  }
  async getLaundryEventsAmount(laundryId: string): Promise<number> {
    throw new Error('Method not implemented.');
    try {
    } catch (error) {
      throw error;
    }
  }
  async getWashMachineEvents(
    washMachineId: string,
    page: number,
    size: number
  ): Promise<Client[]> {
    throw new Error('Method not implemented.');
    try {
    } catch (error) {
      throw error;
    }
  }
  async getWashMachineEventsAmount(washMachineId: string): Promise<number> {
    throw new Error('Method not implemented.');
    try {
    } catch (error) {
      throw error;
    }
  }

  private _getEvent(event: any): Event | null {
    if (!event) {
      return null;
    }

    return new Event(
      event?.washMachineId,
      event?.temperature,
      event?.spinning,
      event?.mode?._id.toString(),
      event?.additionalMode?._id.toString(),
      event?._id.toString(),
      null,
      new Mode(
        event?.mode?.name,
        event?.mode?.time,
        event?.mode?.number,
        '',
        event?.mode?._id.toString()
      ),
      new AdditionalMode(
        event?.additionalMode?.name,
        event?.additionalMode?.time,
        event?.additionalMode?.number,
        '',
        event?.additionalMode?._id.toString()
      ),
      event?.client?._id.toString(),
      null,
      event?.timeBegin,
      event?.timeEnd,
      event?.paidStatus,
      event?.paidBonuses,
      event?.paidMoney,
      event?.taken,
      event?.rating
    );
  }
}
