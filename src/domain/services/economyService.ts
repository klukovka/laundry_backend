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

  async laundryEarnings(
    laundryId: String,
    beginDate: Date,
    endDate: Date
  ): Promise<any> {
    try {
      const events = (await this._eventRepository.getAllWithInfo()).filter(
        (event) => {
          if (event.timeBegin == null) return false;
          return (
            event.washMachine?.laundryId == laundryId &&
            event.paidStatus == true &&
            new Date(beginDate) <= event.timeBegin! &&
            new Date(endDate) >= event.timeBegin!
          );
        }
      );
      let sum: number = 0;
      events.forEach((event) => {
        sum += event.mode!.costs;
        if (event.additionalMode != null) {
          sum += event.additionalMode!.costs;
        }
      });
      return sum;
    } catch (error) {
      throw error;
    }
  }
}
