import { Mode } from '../../domain/models/Mode';
import { ModeRepository } from '../../domain/repositories/ModeRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class ModeMongoRepository implements ModeRepository {
  async create(mode: Mode): Promise<void> {
    try {
      await DatabaseMongo.getDB.createMode(mode);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async update(idMode: string, options: Map<string, any>): Promise<void> {
    try {
      const objectOptions = {
        name: options.get('name'),
        time: options.get('time'),
        costs: options.get('costs'),
      };
      await DatabaseMongo.getDB.updateMode(idMode, objectOptions);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(idMode: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteMode(idMode);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async get(idMode: string): Promise<Mode | null> {
    try {
      const mode = await DatabaseMongo.getDB.getMode(idMode);
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
