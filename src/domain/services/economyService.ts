import { Client } from '../models/client';
import { Event } from '../models/event';
import { Mode } from '../models/mode';
import { WashMachine } from '../models/washMachine';
import { EventRepository } from '../repositories/eventRepository';
import { WashMachineRepository } from '../repositories/washMachineRepository';

export class EconomyService {
  private _wachMachineRepository: WashMachineRepository;
  private _eventRepository: EventRepository;

  constructor(
    wachMachineRepository: WashMachineRepository,
    eventRepository: EventRepository
  ) {
    this._wachMachineRepository = wachMachineRepository;
    this._eventRepository = eventRepository;
  }

  async laundryGivedBonuses(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<any> {
    const percent = 0.1;
    let laundryMapEarnings = await this._laundryMapEarnings(
      laundryId,
      beginDate,
      endDate
    );
    let clientsAndPayment = new Map<String, number>();
    let washMachinesAndPayment = new Map<String, number>();

    laundryMapEarnings.clientsAndPayment.forEach(
      (value: number, key: String) => {
        clientsAndPayment.set(key, value * percent);
      }
    );
    laundryMapEarnings.washMachinesAndPayment.forEach(
      (value: number, key: String) => {
        washMachinesAndPayment.set(key, value * percent);
      }
    );

    return {
      clientsAndPayment: Object.fromEntries(clientsAndPayment),
      washMachinesAndPayment: Object.fromEntries(washMachinesAndPayment),
      sum: laundryMapEarnings.sum * percent,
    };
  }

  async laundryEarnings(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const laundryMapEarnings = await this._laundryMapEarnings(
        laundryId,
        beginDate,
        endDate
      );
      return {
        clientsAndPayment: Object.fromEntries(
          laundryMapEarnings.clientsAndPayment
        ),
        washMachinesAndPayment: Object.fromEntries(
          laundryMapEarnings.washMachinesAndPayment
        ),
        sum: laundryMapEarnings.sum,
      };
    } catch (error) {
      throw error;
    }
  }

  private async _laundryMapEarnings(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const events = await this._laundryEvents(laundryId, beginDate, endDate);
      let clientsAndPayment = new Map<String, number>();
      let washMachinesAndPayment = new Map<String, number>();
      let sum: number = 0;

      events.forEach((event) => {
        const clientId = event.clientId ?? 'undefined';
        const washMachineId = event.washMachineId ?? 'undefined';
        let clientPayment = clientsAndPayment.get(clientId) ?? 0;
        let washMachinePayment = washMachinesAndPayment.get(washMachineId) ?? 0;

        sum += event.mode!.costs;
        clientPayment += event.mode!.costs;
        washMachinePayment += event.mode!.costs;

        if (event.additionalMode != null) {
          sum += event.additionalMode!.costs;
          clientPayment += event.additionalMode!.costs;
          washMachinePayment += event.additionalMode!.costs;
        }

        sum -= event.paidBonuses;
        clientPayment -= event.paidBonuses;
        washMachinePayment -= event.paidBonuses;

        clientsAndPayment.set(clientId, clientPayment);
        washMachinesAndPayment.set(washMachineId, washMachinePayment);
      });

      return {
        clientsAndPayment: clientsAndPayment,
        washMachinesAndPayment: washMachinesAndPayment,
        sum: sum,
      };
    } catch (error) {
      throw error;
    }
  }

  async laundryTakenBonuses(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const events = await this._laundryEvents(laundryId, beginDate, endDate);
      let clientsAndPaidBonuses = new Map<String, number>();
      let sum: number = 0;
      events.forEach((event) => {
        const clientId = event.clientId ?? 'undefined';
        let clientPayment = clientsAndPaidBonuses.get(clientId) ?? 0;
        sum += event.paidBonuses;
        clientPayment += event.paidBonuses;
        clientsAndPaidBonuses.set(clientId, clientPayment);
      });
      return {
        clientsAndPaidBonuses: Object.fromEntries(clientsAndPaidBonuses),
        sum: sum,
      };
    } catch (error) {
      throw error;
    }
  }

  async laundryTheMostPopularMode(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const events = await this._laundryEvents(laundryId, beginDate, endDate);
      let modesCounter = new Map<String, number>();

      let max = 0;
      events.forEach((event) => {
        const mode = event.modeId;
        let modeCount = modesCounter.get(mode) ?? 0;
        modesCounter.set(mode, ++modeCount);
        if (modeCount > max) max = modeCount;
      });

      let maxModes = new Array<String>();
      modesCounter.forEach((value: number, key: String) => {
        if (value == max) maxModes.push(key);
      });
      return { modes: maxModes, count: max };
    } catch (error) {
      throw error;
    }
  }

  private async _laundryEvents(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<Event[]> {
    return (await this._eventRepository.getAllWithInfo()).filter((event) => {
      if (event.timeBegin == null) return false;
      return (
        event.washMachine?.laundryId == laundryId &&
        event.paidStatus == true &&
        new Date(beginDate) <= event.timeBegin! &&
        new Date(endDate) >= event.timeBegin!
      );
    });
  }
}
