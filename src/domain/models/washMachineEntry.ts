import { WashMachine } from "./washMachine";

export class WashMachineEntry<T> {
  washMachine: WashMachine;
  value: T;

  constructor(washMachine: WashMachine, value: T) {
    this.washMachine = washMachine;
    this.value = value;
  }
}
