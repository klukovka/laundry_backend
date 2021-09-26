import { AdditionalMode } from '../../domain/models/additionalMode';
import { Client } from '../../domain/models/client';
import { Event } from '../../domain/models/event';
import { Mode } from '../../domain/models/mode';
import { WashMachine } from '../../domain/models/washMachine';
import { EventRepository } from '../../domain/repositories/eventRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class EventMongoRepository implements EventRepository {
  async create(event: Event): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createEvent(event);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async update(eventId: string, options: Map<string, any>): Promise<void> {
    try {
      const objectOptions = {
        client: options.get('client'),
        paidBonuses: options.get('paidBonuses'),
        timeBegin: options.get('timeBegin'),
        paidStatus: options.get('paidStatus'),
        taken: options.get('taken'),
      };
      return await DatabaseMongo.getDB.updateEvent(eventId, objectOptions);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(eventId: string): Promise<void> {
    try {
      return await DatabaseMongo.getDB.deleteEvent(eventId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async get(eventId: string): Promise<Event | null> {
    try {
      const event = await DatabaseMongo.getDB.getEvent(eventId);
      if (event) {
        return new Event(
          event.washMachine?._id.toString(),
          event.temperature,
          event.spinning,
          event.mode?._id.toString(),
          event.additionalMode?._id.toString(),
          event?._id.toString(),
          null,
          null,
          null,
          event.client?._id.toString(),
          null,
          event.timeBegin,
          event.paidStatus,
          event.paidBonuses,
          event.taken
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAll(): Promise<Event[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllEvents();
      let events = new Array<Event>();
      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          events.push(
            new Event(
              documents[i].washMachine?._id.toString(),
              documents[i].temperature,
              documents[i].spinning,
              documents[i].mode?._id.toString(),
              documents[i].additionalMode?._id.toString(),
              documents[i]?._id.toString(),
              null,
              null,
              null,
              documents[i].client?._id.toString(),
              null,
              documents[i].timeBegin,
              documents[i].paidStatus,
              documents[i].paidBonuses,
              documents[i].taken
            )
          );
        }
      }

      return events;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getWithInfo(eventId: string): Promise<Event | null> {
    try {
      const event = await DatabaseMongo.getDB.getEventWithInfo(eventId);
      if (event) {
        return new Event(
          event.washMachine?._id.toString(),
          event.temperature,
          event.spinning,
          event.mode?._id.toString(),
          event.additionalMode?._id.toString(),
          event?._id.toString(),
          new WashMachine(
            event.washMachine?.model,
            event.washMachine?.manufacturer,
            event.washMachine?.capacity,
            event.washMachine?.powerUsage,
            event.washMachine?.spinningSpeed,
            event.washMachine?.laundry?._id.toString(),
            event.washMachine?._id.toString()
          ),
          new Mode(
            event.mode?.name,
            event.mode?.time,
            event.mode?.costs,
            event.mode?._id.toString()
          ),
          new AdditionalMode(
            event.additionalMode?.name,
            event.additionalMode?.time,
            event.additionalMode?.costs,
            event.additionalMode?._id.toString()
          ),
          event.client?._id.toString(),
          new Client(
            event.client?.name,
            event.client?.surname,
            event.client?.phone,
            event.client?.user?._id.toString()
          ),
          event.timeBegin,
          event.paidStatus,
          event.paidBonuses,
          event.taken
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllWithInfo(): Promise<Event[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllEventsWithInfo();
      let events = new Array<Event>();
      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          events.push(
            new Event(
              documents[i].washMachine?._id.toString(),
              documents[i].temperature,
              documents[i].spinning,
              documents[i].mode?._id.toString(),
              documents[i].additionalMode?._id.toString(),
              documents[i]?._id.toString(),
              new WashMachine(
                documents[i].washMachine?.model,
                documents[i].washMachine?.manufacturer,
                documents[i].washMachine?.capacity,
                documents[i].washMachine?.powerUsage,
                documents[i].washMachine?.spinningSpeed,
                documents[i].washMachine?.laundry?._id.toString(),
                documents[i].washMachine?._id.toString()
              ),
              new Mode(
                documents[i].mode?.name,
                documents[i].mode?.time,
                documents[i].mode?.costs,
                documents[i].mode?._id.toString()
              ),
              new AdditionalMode(
                documents[i].additionalMode?.name,
                documents[i].additionalMode?.time,
                documents[i].additionalMode?.costs,
                documents[i].additionalMode?._id.toString()
              ),
              documents[i].client?._id.toString(),
              new Client(
                documents[i].client?.name,
                documents[i].client?.surname,
                documents[i].client?.phone,
                documents[i].client?.user?._id.toString()
              ),
              documents[i].timeBegin,
              documents[i].paidStatus,
              documents[i].paidBonuses,
              documents[i].taken
            )
          );
        }
      }

      return events;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
