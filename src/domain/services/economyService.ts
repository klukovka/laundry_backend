import event from '../../data/dataSource/mongoDB/models/event';
import { Event } from '../models/event';
import { EventRepository } from '../repositories/eventRepository';

export class EconomyService {
  private _eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
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
    let clientsAndBonuses = new Map<String, number>();
    let washMachinesAndBonuses = new Map<String, number>();

    laundryMapEarnings.clientsAndPayment.forEach(
      (value: number, key: String) => {
        clientsAndBonuses.set(key, value * percent);
      }
    );
    laundryMapEarnings.washMachinesAndPayment.forEach(
      (value: number, key: String) => {
        washMachinesAndBonuses.set(key, value * percent);
      }
    );

    return {
      clientsAndBonuses: Object.fromEntries(clientsAndBonuses),
      washMachinesAndBonuses: Object.fromEntries(washMachinesAndBonuses),
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

  async laundryWashMachinesTimeAndEnergy(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const events = await this._laundryEvents(laundryId, beginDate, endDate);
      let washMachinesTime = new Map<String, number>();
      let washMachinesEnergy = new Map<String, number>();
      let allTime = 0;
      let allEnergy = 0;
      events.forEach((event) => {
        let washMachine = event.washMachineId;
        let washMachineTime = washMachinesTime.get(washMachine) ?? 0;
        let modeTime = event.mode?.time ?? 0;
        let addModeTime = event.additionalMode?.time ?? 0;
        allTime += modeTime + addModeTime;
        let powerUsage = (event.washMachine?.powerUsage ?? 1) / 60;
        allEnergy += powerUsage * (modeTime + addModeTime);
        washMachinesTime.set(
          washMachine,
          washMachineTime + modeTime + addModeTime
        );
        washMachinesEnergy.set(
          washMachine,
          (washMachineTime + modeTime + addModeTime) * powerUsage
        );
      });
      return {
        time: allTime,
        energy: allEnergy,
        washMachinesTime: Object.fromEntries(washMachinesTime),
        washMachinesEnergy: Object.fromEntries(washMachinesEnergy),
      };
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

  async laundryRating(laundryId: String): Promise<any> {
    try {
      let events = (await this._eventRepository.getAllWithInfo()).filter(
        (event) =>
          event.timeBegin != null &&
          event.rating != null &&
          event.washMachine?.laundryId == laundryId
      );
      let washMachinesSumRating = new Map<String, any>();
      events.forEach((event) => {
        let washMachine = event.washMachineId;
        let washMachineRating = washMachinesSumRating.get(washMachine) ?? {
          count: 0,
          sum: 0,
        };
        washMachinesSumRating.set(washMachine, {
          count: ++washMachineRating.count,
          sum: washMachineRating.sum + (event.rating ?? 0),
        });
      });

      let countMachines = 0;
      let countRating = 0;
      let washMachinesRating = new Map<String, any>();

      washMachinesSumRating.forEach((value, key) => {
        const rating = value.sum / value.count;
        washMachinesRating.set(key, rating);
        ++countMachines;
        countRating += rating;
      });

      return {
        rating: countRating / countMachines,
        washMachinesRating: Object.fromEntries(washMachinesRating),
      };
    } catch (error) {
      throw error;
    }
  }
}
