import { Laundry } from "./laundry";
import { WashMachine } from "./washMachine";
import { WashMachineEntry } from "./washMachineEntry";

export class StatisticLaundry<T> {
  laundry: Laundry;
  laundryValue: T;
  washMachineValue: Array<WashMachineEntry<T>>;

  constructor(
    laundry: Laundry,
    laundryValue: T,
    washMachineValue: Array<WashMachineEntry<T>>
  ) {
    this.laundry = laundry;
    this.washMachineValue = washMachineValue;
    this.laundryValue = laundryValue;
  }
}
