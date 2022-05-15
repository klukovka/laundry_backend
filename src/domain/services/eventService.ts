import { EventRepository } from '../repositories/eventRepository';
import { ClientRepository } from '../repositories/clientRepository';
import { LaundryRepository } from '../repositories/laundryRepository';
import { Event } from '../models/event';
import { PagedModel } from '../models/pagedModel';
import firestore from '../../../server';

const minute = 60000;

export class EventService {
  private _eventRepository: EventRepository;
  private _clientRepository: ClientRepository;
  private _laundryRepository: LaundryRepository;

  constructor(
    eventRepository: EventRepository,
    clientRepository: ClientRepository,
    laundryRepository: LaundryRepository
  ) {
    this._eventRepository = eventRepository;
    this._clientRepository = clientRepository;
    this._laundryRepository = laundryRepository;
  }

  async setupEvent(options: any): Promise<string | null> {
    try {
      const eventId = await this._eventRepository.createEvent(
        new Event(
          options.washMachineId,
          options.temperature,
          options.spinning,
          options.modeId,
          options.additionalModeId
        )
      );

      setTimeout(
        function (
          eventId: string | null,
          getEvent: (eventId: string) => Promise<Event | null>,
          deleteEvent: (eventId: string) => Promise<void>
        ) {
          if (eventId) {
            getEvent(eventId).then((event) => {
              if (!event?.paidStatus) {
                deleteEvent(eventId).then((_) => {
                  console.log('Event was deleted');
                });
              }
            });
          }
        },
        minute * 15,
        eventId,
        this._eventRepository.getEvent,
        this._eventRepository.deleteEvent
      );
      return eventId;
    } catch (error) {
      throw error;
    }
  }

  async getEvent(eventId: string): Promise<Event | null> {
    try {
      return await this._eventRepository.getEvent(eventId);
    } catch (error) {
      throw error;
    }
  }

  async payForEvent(options: any): Promise<void> {
    try {
      const clientId = options.userData.id;
      const eventId = options.eventId;
      const event = await this.getEvent(eventId);

      if (!event) {
        throw Error("Event doesn't exist");
      }
      const time =
        (event?.additionalMode?.time ?? 0) + (event?.mode?.time ?? 0);
      const costs =
        (event?.additionalMode?.costs ?? 0) + (event?.mode?.costs ?? 0);

      const paidMoney = costs - options.paidBonuses;

      await this._eventRepository.updateEvent(eventId, {
        client: clientId,
        timeBegin: new Date(),
        paidStatus: true,
        paidBonuses: options.paidBonuses,
        paidMoney: paidMoney,
      });

      await this._eventRepository.updateWashMachine(options.washMachineId, {
        isWashing: true,
      });

      await this._updateClientBonuses(
        options.userData.userId,
        paidMoney,
        options.paidBonuses
      );

      setTimeout(
        function (
          eventId: string,
          updateWashMachineTime: (
            washMachineId: string,
            time: number,
            eventRepository: EventRepository,
            laundryRepository: LaundryRepository
          ) => Promise<void>,
          eventRepository: EventRepository,
          laundryRepository: LaundryRepository
        ) {
          const notifications = firestore.collection('Notifications');
          notifications.doc(eventId).set({
            title: 'Wathing is over!',
            body: "Don't forget to take your clothes",
          });
          eventRepository
            .updateEvent(eventId, {
              timeEnd: new Date(),
            })
            .then((_) => {
              updateWashMachineTime(
                options.washMachineId,
                time,
                eventRepository,
                laundryRepository
              ).then((_) => {
                console.log('Wash machine updated');
              });
            });
        },
        minute * time,
        eventId,
        this._updateWashMachineTime,
        this._eventRepository,
        this._laundryRepository
      );
    } catch (error) {
      throw error;
    }
  }

  async takeEvent(eventId: string): Promise<void> {
    try {
      await this._eventRepository.updateEvent(eventId, {
        taken: true,
        timeEnd: new Date(),
      });
      const event = await this._eventRepository.getEvent(eventId);
      await this._eventRepository.updateWashMachine(event?.washMachineId!, {
        isWashing: false,
      });
    } catch (error) {
      throw error;
    }
  }

  async rateEvent(eventId: string, mark: number): Promise<void> {
    try {
      await this._eventRepository.updateEvent(eventId, { rating: mark });
    } catch (error) {
      throw error;
    }
  }

  private async _updateClientBonuses(
    userId: string,
    paidMoney: number,
    paidBonuses: number
  ): Promise<void> {
    try {
      const client = await this._clientRepository.getClientByUserId(userId);
      if (client) {
        const eventsAmount = await this._eventRepository.getClientEventsAmount(
          client?.clientId!
        );
        const futureSale = Math.ceil(eventsAmount / 100);
        const sale = futureSale > 50 ? 50 : futureSale;
        const bonuses = Math.ceil((paidMoney * sale) / 100);
        await this._eventRepository.updateClient(client?.clientId!, {
          sale: sale,
          bonuses: client?.bonuses! - paidBonuses + bonuses,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  private async _updateWashMachineTime(
    washMachineId: string,
    time: number,
    eventRepository: EventRepository,
    laundryRepository: LaundryRepository
  ): Promise<void> {
    try {
      const washMachine = await laundryRepository.getWashMachineById(
        washMachineId
      );
      let options;
      if (washMachine) {
        const currentTime = (washMachine?.currentTime ?? 0) + time;
        if (currentTime < (washMachine?.maxTime ?? 0)) {
          options = { currentTime: currentTime };
        } else {
          options = { currentTime: 0, isWorking: false };
        }

        await eventRepository.updateWashMachine(washMachineId, options);
      }
    } catch (error) {
      throw error;
    }
  }

  async getClientEvents(
    clientId: string,
    options: any
  ): Promise<PagedModel<Event>> {
    try {
      const page = Number(options.page ?? 0);
      const size = Number(options.size ?? 20);
      const content = await this._eventRepository.getClientEvents(
        clientId,
        page,
        size
      );
      const totalElements = await this._eventRepository.getClientEventsAmount(
        clientId
      );

      return new PagedModel<Event>(
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

  async getLaundryEvents(
    laundryId: string,
    options: any
  ): Promise<PagedModel<Event>> {
    try {
      const page = Number(options.page ?? 0);
      const size = Number(options.size ?? 20);
      const content = await this._eventRepository.getLaundryEvents(
        laundryId,
        page,
        size
      );
      const totalElements = await this._eventRepository.getLaundryEventsAmount(
        laundryId
      );

      return new PagedModel<Event>(
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

  async getWashMachineEvents(
    washMachineId: string,
    options: any
  ): Promise<PagedModel<Event>> {
    try {
      const page = Number(options.page ?? 0);
      const size = Number(options.size ?? 20);
      const content = await this._eventRepository.getWashMachineEvents(
        washMachineId,
        page,
        size
      );
      const totalElements =
        await this._eventRepository.getWashMachineEventsAmount(washMachineId);

      return new PagedModel<Event>(
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

  async getAllEvents(options: any): Promise<PagedModel<Event>> {
    try {
      const page = Number(options.page ?? 0);
      const size = Number(options.size ?? 20);
      const content = await this._eventRepository.getAllEvents(page, size);
      const totalElements = await this._eventRepository.getAllEventsAmount();

      return new PagedModel<Event>(
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
}
