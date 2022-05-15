import { StatisticLaundry } from '../models/statisticLaundry';
import { WashMachine } from '../models/washMachine';
import { Laundry } from '../models/laundry';
import { PagedModel } from '../models/pagedModel';
import { EventRepository } from '../repositories/eventRepository';
import { LaundryRepository } from '../repositories/laundryRepository';

export class StatisticService {
  private _eventRepository: EventRepository;
  private _laundryRepository: LaundryRepository;

  constructor(
    eventRepository: EventRepository,
    laundryRepository: LaundryRepository
  ) {
    this._eventRepository = eventRepository;
    this._laundryRepository = laundryRepository;
  }

  async allLaundryRatingStatistic(
    query: any
  ): Promise<PagedModel<StatisticLaundry<number>>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements = await this._laundryRepository.getLaundriesAmount();
      const laundries = await this._laundryRepository.getLaundries(page, size);

      const content = new Array<StatisticLaundry>();
      if (laundries) {
        for (let i = 0; i < laundries.length; i++) {
          content.push(
            await this.laundryRatingStatistic(laundries[i].laundryId!)
          );
        }
      }

      return new PagedModel<StatisticLaundry<number>>(
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

  async laundryRatingStatistic(
    laundryId: string
  ): Promise<StatisticLaundry<number>> {
    try {
      const laundry = await this._laundryRepository.getLaundryById(laundryId);

      const washMachinesAmount =
        await this._laundryRepository.getWashMachinesAmount(laundryId);
      const washMachines = await this._laundryRepository.getWashMachines(
        laundryId,
        0,
        washMachinesAmount
      );

      const laundryRating = (await this._laundryRating(laundry!)) ?? 0;

      let washMachinesRating = new Map<WashMachine, number>();

      for (let i = 0; i < washMachines.length; i++) {
        const rating = await this._washMachineRating(washMachines[i]);
        if (rating) {
          washMachinesRating.set(washMachines[i], rating);
        }
      }

      return new StatisticLaundry<number>(
        laundry!,
        laundryRating,
        washMachinesRating
      );
    } catch (error) {
      throw error;
    }
  }

  private async _laundryRating(laundry: Laundry): Promise<number | null> {
    try {
      const eventsAmount = await this._eventRepository.getLaundryEventsAmount(
        laundry.laundryId!
      );
      if (eventsAmount == 0) return null;

      const events = await this._eventRepository.getLaundryEvents(
        laundry.laundryId!,
        0,
        eventsAmount
      );

      let sum = 0;
      for (let i = 0; i < events.length; i++) {
        sum += events[i]?.rating ?? 0;
      }

      return sum / eventsAmount;
    } catch (error) {
      throw error;
    }
  }

  private async _washMachineRating(
    washMachine: WashMachine
  ): Promise<number | null> {
    try {
      const eventsAmount =
        await this._eventRepository.getWashMachineEventsAmount(
          washMachine.washMachineId!
        );
      if (eventsAmount == 0) return null;

      const events = await this._eventRepository.getWashMachineEvents(
        washMachine.washMachineId!,
        0,
        eventsAmount
      );

      let sum = 0;
      for (let i = 0; i < events.length; i++) {
        sum += events[i]?.rating ?? 0;
      }

      return sum / eventsAmount;
    } catch (error) {
      throw error;
    }
  }
}
