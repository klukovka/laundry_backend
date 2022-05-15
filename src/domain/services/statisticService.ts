import { StatisticLaundry } from "../models/statisticLaundry";
import { WashMachine } from "../models/washMachine";
import { Laundry } from "../models/laundry";
import { Event } from "../models/event";
import { RepairEvent } from "../models/repairEvent";
import { PagedModel } from "../models/pagedModel";
import { EventRepository } from "../repositories/eventRepository";
import { LaundryRepository } from "../repositories/laundryRepository";
import { RepairCompanyRepository } from "../repositories/repairCompanyRepository";

export class StatisticService {
  private _eventRepository: EventRepository;
  private _laundryRepository: LaundryRepository;
  private _repairCompanyRepository: RepairCompanyRepository;

  constructor(
    eventRepository: EventRepository,
    laundryRepository: LaundryRepository,
    repairCompanyRepository: RepairCompanyRepository
  ) {
    this._eventRepository = eventRepository;
    this._laundryRepository = laundryRepository;
    this._repairCompanyRepository = repairCompanyRepository;
  }

  async allLaundryRatingStatistic(
    query: any
  ): Promise<PagedModel<StatisticLaundry<number>>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements = await this._laundryRepository.getLaundriesAmount();
      const laundries = await this._laundryRepository.getLaundries(page, size);

      const content = new Array<StatisticLaundry<number>>();
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

      return this._countRating(events, eventsAmount);
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

      return this._countRating(events, eventsAmount);
    } catch (error) {
      throw error;
    }
  }

  private _countRating(events: Event[], eventsAmount: number) {
    let sum = 0;
    for (let i = 0; i < events.length; i++) {
      sum += events[i]?.rating ?? 0;
    }

    return sum / eventsAmount;
  }

  async allLaundryPaymentStatistic(
    query: any
  ): Promise<PagedModel<StatisticLaundry<any>>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements = await this._laundryRepository.getLaundriesAmount();
      const laundries = await this._laundryRepository.getLaundries(page, size);

      const content = new Array<StatisticLaundry<any>>();
      if (laundries) {
        for (let i = 0; i < laundries.length; i++) {
          content.push(
            await this.laundryPaymentStatistic(laundries[i].laundryId!)
          );
        }
      }

      return new PagedModel<StatisticLaundry<any>>(
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

  async laundryPaymentStatistic(
    laundryId: string
  ): Promise<StatisticLaundry<any>> {
    try {
      const laundry = await this._laundryRepository.getLaundryById(laundryId);

      const washMachinesAmount =
        await this._laundryRepository.getWashMachinesAmount(laundryId);
      const washMachines = await this._laundryRepository.getWashMachines(
        laundryId,
        0,
        washMachinesAmount
      );

      const laundryPayment = await this._laundryPayments(laundry!);

      let washMachinesPaymments = new Map<WashMachine, any>();

      for (let i = 0; i < washMachines.length; i++) {
        const payment = await this._washMachinePayments(washMachines[i]);
        if (payment) {
          washMachinesPaymments.set(washMachines[i], payment);
        }
      }

      return new StatisticLaundry<any>(
        laundry!,
        laundryPayment,
        washMachinesPaymments
      );
    } catch (error) {
      throw error;
    }
  }

  private async _laundryPayments(laundry: Laundry): Promise<number | null> {
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

      return this._countPayment(events);
    } catch (error) {
      throw error;
    }
  }

  private async _washMachinePayments(washMachine: WashMachine): Promise<any> {
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

      return this._countPayment(events);
    } catch (error) {
      throw error;
    }
  }

  private _countPayment(events: Event[]): any {
    let sum = { paidBonuses: 0, paidMoney: 0, all: 0 };
    for (let i = 0; i < events.length; i++) {
      sum.paidBonuses += events[i].paidBonuses;
      sum.paidMoney += events[i].paidMoney;
      sum.all += events[i].paidBonuses + events[i].paidMoney;
    }

    return sum;
  }

  async allLaundryTimeAndUsageStatistic(
    query: any
  ): Promise<PagedModel<StatisticLaundry<any>>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements = await this._laundryRepository.getLaundriesAmount();
      const laundries = await this._laundryRepository.getLaundries(page, size);

      const content = new Array<StatisticLaundry<any>>();
      if (laundries) {
        for (let i = 0; i < laundries.length; i++) {
          content.push(
            await this.laundryTimeAndUsageStatistic(laundries[i].laundryId!)
          );
        }
      }

      return new PagedModel<StatisticLaundry<any>>(
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

  async laundryTimeAndUsageStatistic(
    laundryId: string
  ): Promise<StatisticLaundry<any>> {
    try {
      const laundry = await this._laundryRepository.getLaundryById(laundryId);

      const washMachinesAmount =
        await this._laundryRepository.getWashMachinesAmount(laundryId);
      const washMachines = await this._laundryRepository.getWashMachines(
        laundryId,
        0,
        washMachinesAmount
      );

      let washMachinesTimeAndUsage = new Map<WashMachine, any>();

      for (let i = 0; i < washMachines.length; i++) {
        const timeAndUsage = await this._washMachineTimeAndUsage(
          washMachines[i]
        );
        if (timeAndUsage) {
          washMachinesTimeAndUsage.set(washMachines[i], timeAndUsage);
        }
      }

      return new StatisticLaundry<any>(
        laundry!,
        this._laundryTimeAndUsage(washMachinesTimeAndUsage),
        washMachinesTimeAndUsage
      );
    } catch (error) {
      throw error;
    }
  }

  private _laundryTimeAndUsage(map: Map<WashMachine, any>) {
    let sum = { time: 0, powerUsage: 0 };

    map.forEach((value: any, key: WashMachine) => {
      sum.time += value.time;
      sum.powerUsage += value.powerUsage;
    });

    return sum;
  }

  private async _washMachineTimeAndUsage(
    washMachine: WashMachine
  ): Promise<any> {
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

      let sum = { time: 0, powerUsage: 0 };

      for (let i = 0; i < events.length; i++) {
        const diff =
          Math.abs(
            events[i]!.timeEnd!.getTime() - events[i]!.timeBegin!.getTime()
          ) /
          1000 /
          60;
        sum.time += diff;
        sum.powerUsage += diff * washMachine.powerUsage;
      }
      return sum;
    } catch (error) {
      throw error;
    }
  }

  async allLaundryRepairEventStatistic(
    query: any
  ): Promise<PagedModel<StatisticLaundry<any>>> {
    try {
      const page = Number(query.page ?? 0);
      const size = Number(query.size ?? 15);
      const totalElements = await this._laundryRepository.getLaundriesAmount();
      const laundries = await this._laundryRepository.getLaundries(page, size);

      const content = new Array<StatisticLaundry<any>>();
      if (laundries) {
        for (let i = 0; i < laundries.length; i++) {
          content.push(
            await this.laundryRepairEventStatistic(laundries[i].laundryId!)
          );
        }
      }

      return new PagedModel<StatisticLaundry<any>>(
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

  async laundryRepairEventStatistic(
    laundryId: string
  ): Promise<StatisticLaundry<any>> {
    try {
      const laundry = await this._laundryRepository.getLaundryById(laundryId);

      const washMachinesAmount =
        await this._laundryRepository.getWashMachinesAmount(laundryId);
      const washMachines = await this._laundryRepository.getWashMachines(
        laundryId,
        0,
        washMachinesAmount
      );

      const laundryRepairEvent = await this._laundryRepairEvent(laundry!);

      let washMachinesRepairEvents = new Map<WashMachine, any>();

      for (let i = 0; i < washMachines.length; i++) {
        const statistic = await this._washMachineRepairEvent(washMachines[i]);
        if (statistic) {
          washMachinesRepairEvents.set(washMachines[i], statistic);
        }
      }

      return new StatisticLaundry<any>(
        laundry!,
        laundryRepairEvent,
        washMachinesRepairEvents
      );
    } catch (error) {
      throw error;
    }
  }

  private async _laundryRepairEvent(laundry: Laundry): Promise<any> {
    try {
      const eventsAmount =
        await this._repairCompanyRepository.getRepairEventsAmount({
          laundry: laundry.laundryId!,
        });
      if (eventsAmount == 0) return null;

      const events = await this._repairCompanyRepository.getRepairEvents({
        laundry: laundry.laundryId!,
      });

      return this._countRepairEvents(events);
    } catch (error) {
      throw error;
    }
  }

  private async _washMachineRepairEvent(
    washMachine: WashMachine
  ): Promise<any> {
    try {
      const eventsAmount =
        await this._repairCompanyRepository.getRepairEventsAmount({
          washMachine: washMachine.washMachineId!,
        });
      if (eventsAmount == 0) return null;

      const events = await this._repairCompanyRepository.getRepairEvents({
        washMachine: washMachine.washMachineId!,
      });

      return this._countRepairEvents(events);
    } catch (error) {
      throw error;
    }
  }

  private _countRepairEvents(events: RepairEvent[]): any {
    let statistic = { amount: events.length, money: 0 };
    for (let i = 0; i < events.length; i++) {
      statistic.money += events[i].costs;
    }

    return statistic;
  }
}
