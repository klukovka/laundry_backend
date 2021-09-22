import { AdditionalMode } from './additionalMode';
import { Client } from './client';
import { Mode } from './mode';
import { WashMachine } from './washMachine';

export class Event {
  idEvent?: string | null;
  idWashMachine: string;
  washMachine?: WashMachine | null;
  idClient: string;
  client?: Client | null;
  timeBegin: Date;
  timeEnd: Date;
  paidStatus: boolean;
  paidSum: Number;
  paidBonuses: Number;
  idMode: string;
  mode?: Mode | null;
  idAdditionalMode: string;
  additionalMode?: AdditionalMode | null;

  constructor(
    idWashMachine: string,
    idClient: string,
    timeBegin: Date,
    timeEnd: Date,
    paidSum: Number,
    idMode: string,
    idAdditionalMode: string,
    paidStatus: boolean = false,
    paidBonuses: Number = 0,
    idEvent: string | null = null,
    washMachine: WashMachine | null = null,
    client: Client | null = null,
    mode: Mode | null = null,
    additionalMode: AdditionalMode | null = null
  ) {
    this.idWashMachine = idWashMachine;
    this.idClient = idClient;
    this.timeBegin = timeBegin;
    this.timeEnd = timeEnd;
    this.paidSum = paidSum;
    this.idMode = idMode;
    this.idAdditionalMode = idAdditionalMode;
    this.paidStatus = paidStatus;
    this.paidBonuses = paidBonuses;
    this.idEvent = idEvent;
    this.washMachine = washMachine;
    this.client = client;
    this.mode = mode;
    this.additionalMode = additionalMode;
  }
}
