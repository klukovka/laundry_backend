import { Event } from '../models/event';
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
  ): Promise<number> {
    const percent = 0.1;
    let sum = await this.laundryEarnings(laundryId, beginDate, endDate);
    return sum * percent;
  }

  async laundryEarnings(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<number> {
    try {
      const events = await this._laundryEvents(laundryId, beginDate, endDate);
      let sum: number = 0;
      events.forEach((event) => {
        sum += event.mode!.costs;
        if (event.additionalMode != null) {
          sum += event.additionalMode!.costs;
        }
      });
      const takenBonuses = await this.laundryTakenBonuses(
        laundryId,
        beginDate,
        endDate
      );
      return sum - takenBonuses;
    } catch (error) {
      throw error;
    }
  }

  async laundryTakenBonuses(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<number> {
    try {
      const events = await this._laundryEvents(laundryId, beginDate, endDate);
      let sum: number = 0;
      events.forEach((event) => {
        sum += event.paidBonuses;
      });
      return sum;
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
