import { AdditionalMode } from './additionalMode';
import { Client } from './client';
import { Mode } from './mode';
import { WashMachine } from './washMachine';

export class Event {
  eventId?: string | null;
  washMachineId: string;
  washMachine?: WashMachine | null;
  clientId: string;
  client?: Client | null;
  timeBegin: Date;
  timeEnd: Date;
  paidStatus: boolean;
  paidSum: Number;
  paidBonuses: Number;
  modeId: string;
  mode?: Mode | null;
  additionalModeId: string;
  additionalMode?: AdditionalMode | null;

  constructor(
    washMachineId: string,
    clientId: string,
    timeBegin: Date,
    timeEnd: Date,
    paidSum: Number,
    modeId: string,
    additionalModeId: string,
    paidStatus: boolean = false,
    paidBonuses: Number = 0,
    eventId: string | null = null,
    washMachine: WashMachine | null = null,
    client: Client | null = null,
    mode: Mode | null = null,
    additionalMode: AdditionalMode | null = null
  ) {
    this.washMachineId = washMachineId;
    this.clientId = clientId;
    this.timeBegin = timeBegin;
    this.timeEnd = timeEnd;
    this.paidSum = paidSum;
    this.modeId = modeId;
    this.additionalModeId = additionalModeId;
    this.paidStatus = paidStatus;
    this.paidBonuses = paidBonuses;
    this.eventId = eventId;
    this.washMachine = washMachine;
    this.client = client;
    this.mode = mode;
    this.additionalMode = additionalMode;
  }
}
