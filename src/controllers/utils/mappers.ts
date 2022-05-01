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
}
