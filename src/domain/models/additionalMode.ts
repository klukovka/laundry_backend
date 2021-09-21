export class AdditionalMode {
  idAdditionalMode?: string | null;
  name: string;
  time: Number;
  costs: Number;

  constructor(
    name: string,
    time: Number,
    costs: Number,
    idAdditionalMode: string | null = null
  ) {
    this.costs = costs;
    this.idAdditionalMode = idAdditionalMode;
    this.name = name;
    this.time = time;
  }
}
