import { StatisticModel } from '../../domain/models/statistic_model';

export class Mappers {
  static mapRequestParamsToMap(
    options: [{ propName: string; value: any }]
  ): Map<string, any> {
    let updateOps = new Map<string, any>();

    for (const ops of options) {
      updateOps.set(ops.propName, ops.value);
    }
    return updateOps;
  }

  static mapToModel(map: Map<String, any>): Array<StatisticModel> {
    let models = new Array<StatisticModel>();
    map.forEach((value: any, key: String) => {
      models.push(new StatisticModel(key, value));
    });
    return models;
  }
}
