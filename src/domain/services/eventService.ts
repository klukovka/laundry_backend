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

      setTimeout(function () {
        if (eventId) {
          this._eventRepository.getEvent(eventId).then((event) => {
            if (!event?.paidStatus) {
              this._eventRepository.deleteEvent(eventId).then((_) => {
                console.log('Event was deleted');
              });
            }
          });
        }
      }, minute * 15);

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

      setTimeout(function () {
        const notifications = firestore.collection('Notifications');
        notifications.doc(eventId).set({
          title: 'Wathing is over!',
          body: "Don't forget to take your clothes",
        });
        this._eventRepository
          .updateEvent(eventId, {
            timeEnd: Date.now(),
          })
          .then((_) => {
            this._updateWashMachineTime(
              options.washMachineId,
              eventId,
              time
            ).then((_) => {
              console.log('Wash machine updated');
            });
          });
      }, minute * time);

      await this._eventRepository.updateEvent(eventId, {
        client: clientId,
        timeBegin: Date.now(),
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
    } catch (error) {
      throw error;
    }
  }

  async takeEvent(eventId: string): Promise<void> {
    try {
      await this._eventRepository.updateEvent(eventId, { taken: true });
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
    eventId: string,
    time: number
  ): Promise<void> {
    try {
      const washMachine = await this._laundryRepository.getWashMachineById(
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

        await this._eventRepository.updateWashMachine(washMachineId, options);

        setTimeout(function () {
          this._takeEventAutomatically(eventId).than((_) => {
            console.log('Washing completed');
          });
        }, minute * 120);
      }
    } catch (error) {
      throw error;
    }
  }

  private async _takeEventAutomatically(eventId: string): Promise<void> {
    try {
      const event = await this.getEvent(eventId);
      if (event && !event?.taken) {
        await this._eventRepository.updateWashMachine(event.washMachineId, {
          isWashing: false,
        });
        await this._eventRepository.updateEvent(eventId, { taken: true });

        const client = await this._clientRepository.getClientById(
          event.clientId
        );

        if (client) {
          const sale = client.sale ?? 0;
          this._eventRepository.updateClient(client.clientId!, {
            sale: sale == 0 ? 0 : sale - 1,
          });
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async getClientEvents(
    clientId: string,
    page: number,
    size: number
  ): Promise<PagedModel<Event>> {
    try {
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
    page: number,
    size: number
  ): Promise<PagedModel<Event>> {
    try {
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
    page: number,
    size: number
  ): Promise<PagedModel<Event>> {
    try {
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
}
