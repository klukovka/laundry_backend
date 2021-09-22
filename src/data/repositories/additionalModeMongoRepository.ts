import { AdditionalMode } from '../../domain/models/additionalMode';
import { AdditionalModeRepository } from '../../domain/repositories/additionalModeRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class AdditionalModeMongoRepository implements AdditionalModeRepository {
  async create(additionalMode: AdditionalMode): Promise<void> {
    try {
      await DatabaseMongo.getDB.createAdditionalMode(additionalMode);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async update(
    idAdditionalMode: string,
    options: Map<string, any>
  ): Promise<void> {
    try {
      const objectOptions = {
        name: options.get('name'),
        time: options.get('time'),
        costs: options.get('costs'),
      };
      await DatabaseMongo.getDB.updateAdditionalMode(
        idAdditionalMode,
        objectOptions
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(idAdditionalMode: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteAdditionalMode(idAdditionalMode);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async get(idAdditionalMode: string): Promise<AdditionalMode> {
    try {
      const additionalMode = await DatabaseMongo.getDB.getAdditionalMode(
        idAdditionalMode
      );
      if (additionalMode) {
        return new AdditionalMode(
          additionalMode.name,
          additionalMode.time,
          additionalMode.costs,
          additionalMode?._id.toString()
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAll(): Promise<AdditionalMode[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllAdditionalModes();

      let additionalModes = new Array<AdditionalMode>();

      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          additionalModes.push(
            new AdditionalMode(
              documents[i].name,
              documents[i].time,
              documents[i].costs,
              documents[i]?._id.toString()
            )
          );
        }
      }
      return additionalModes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}