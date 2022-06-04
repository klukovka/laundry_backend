import { WashMachine } from './washMachine';
import { Mode } from './mode';
import { AdditionalMode } from './additionalMode';
import { Client } from './client';

export class Event {
  eventId?: string | null;
  washMachineId: string;
  washMachine: WashMachine | null;
  temperature: number;
  spinning: number;
  modeId: string;
  mode: Mode | null;
  additionalModeId: string | null;
  additionalMode: AdditionalMode | null;

  clientId: string | null;
  client: Client | null;
  timeBegin: Date | null;
  timeEnd: Date | null;
  paidStatus: Boolean;
  paidBonuses: number;
  paidMoney: number;
  taken: Boolean;
  rating: number | null;

  constructor(
    washMachineId: string,
    temperature: number,
    spinning: number,
    modeId: string,
    additionalModeId: string | null = null,
    eventId: string | null = null,
    washMachine: WashMachine | null = null,
    mode: Mode | null = null,
    additionalMode: AdditionalMode | null = null,
    clientId: string | null = null,
    client: Client | null = null,
    timeBegin: Date | null = null,
    timeEnd: Date | null = null,
    paidStatus: Boolean = false,
    paidBonuses: number = 0,
    paidMoney: number = 0,
    taken: Boolean = false,
    rating: number | null = null,
  ) {
    this.eventId = eventId;
    this.washMachineId = washMachineId;
    this.washMachine = washMachine;
    this.temperature = temperature;
    this.spinning = spinning;
    this.modeId = modeId;
    this.mode = mode;
    this.additionalMode = additionalMode;
    this.additionalModeId = additionalModeId;
    this.clientId = clientId;
    this.client = client;
    this.timeBegin = timeBegin;
    this.timeEnd = timeEnd;
    this.paidStatus = paidStatus;
    this.paidBonuses = paidBonuses;
    this.paidMoney = paidMoney;
    this.taken = taken;
    this.rating = rating;
  }
}
