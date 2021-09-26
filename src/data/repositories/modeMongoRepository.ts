import { Mode } from '../../domain/models/mode';
import { ModeRepository } from '../../domain/repositories/modeRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class ModeMongoRepository implements ModeRepository {
  async create(mode: Mode): Promise<void> {
    try {
      await DatabaseMongo.getDB.createMode(mode);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async update(modeId: string, options: Map<string, any>): Promise<void> {
    try {
      const objectOptions = {
        name: options.get('name'),
        time: options.get('time'),
        costs: options.get('costs'),
      };
      await DatabaseMongo.getDB.updateMode(modeId, objectOptions);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(modeId: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteMode(modeId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async get(modeId: string): Promise<Mode | null> {
    try {
      const mode = await DatabaseMongo.getDB.getMode(modeId);
      if (mode) {
        return new Mode(mode.name, mode.time, mode.costs, mode?._id.toString());
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAll(): Promise<Mode[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllModes();

      let modes = new Array<Mode>();

      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          modes.push(
            new Mode(
              documents[i].name,
              documents[i].time,
              documents[i].costs,
              documents[i]?._id.toString()
            )
          );
        }
      }
      return modes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
