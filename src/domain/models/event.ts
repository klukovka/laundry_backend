import { WashMachine } from './washMachine';
import { Mode } from './mode';
import { AdditionalMode } from './additionalMode';
import { Client } from './client';

export class Event {
  eventId?: string | null;
  washMachineId: string;
  washMachine: WashMachine | null;
  temperature: Number;
  spinning: Number;
  modeId: string;
  mode: Mode | null;
  additionalModeId: string | null;
  additionalMode: AdditionalMode | null;

  clientId: string | null;
  client: Client | null;
  timeBegin: Date | null;
  paidStatus: Boolean;
  paidBonuses: Number;
  taken: Boolean;

  constructor(
    washMachineId: string,
    temperature: Number,
    spinning: Number,
    modeId: string,
    additionalModeId: string | null = null,
    eventId: string | null = null,
    washMachine: WashMachine | null = null,
    mode: Mode | null = null,
    additionalMode: AdditionalMode | null = null,
    clientId: string | null = null,
    client: Client | null = null,
    timeBegin: Date | null = null,
    paidStatus: Boolean = false,
    paidBonuses: Number = 0,
    taken: Boolean = false
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
    this.paidStatus = paidStatus;
    this.paidBonuses = paidBonuses;
    this.taken = taken;
  }
}
