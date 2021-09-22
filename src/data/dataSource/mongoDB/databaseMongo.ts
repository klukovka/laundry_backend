import mongoose, { Connection } from 'mongoose';
import Laundry from './models/laundry';
import AdditionalMode from './models/additionalMode';
import Mode from './models/mode';

export class DatabaseMongo {
  private static db: DatabaseMongo;
  private connection: Connection | null = null;

  private constructor() {
    const connectionString = process.env.CONNECTION || '';
    mongoose.Promise = global.Promise;

    mongoose
      .connect(connectionString)
      .then(() => console.log('MongoDB connection opened!'));

    this.connection = mongoose.connection;
    this.connection.on(
      'error',
      console.error.bind(console, 'MongoDB connection error: ')
    );
  }

  static get getDB(): DatabaseMongo {
    if (!DatabaseMongo.db) {
      DatabaseMongo.db = new DatabaseMongo();
    }
    return DatabaseMongo.db;
  }

  close() {
    this.connection
      ?.close()
      .then(() => console.log('MongoDB connection closed!'));
  }

  async createLaundry(laundry: any): Promise<void> {
    try {
      await new Laundry({
        _id: new mongoose.Types.ObjectId(),
        name: laundry.name,
        city: laundry.city,
        street: laundry.street,
        house: laundry.house,
        phone: laundry.phone,
      }).save();
    } catch (error) {
      throw new Error('Laundry creating is failed');
    }
  }

  async createAdditionalMode(additionalMode: any): Promise<void> {
    try {
      await new AdditionalMode({
        _id: new mongoose.Types.ObjectId(),
        name: additionalMode.name,
        time: additionalMode.time,
        costs: additionalMode.costs,
      }).save();
    } catch (error) {
      throw new Error('Additional Mode creating is failed');
    }
  }

  async createMode(mode: any): Promise<void> {
    try {
      await new Mode({
        _id: new mongoose.Types.ObjectId(),
        name: mode.name,
        time: mode.time,
        costs: mode.costs,
      }).save();
    } catch (error) {
      throw new Error('Mode creating is failed');
    }
  }

  async deleteLaundry(idLaundry: string): Promise<void> {
    let laundry;
    try {
      laundry = await Laundry.findOne({ _id: idLaundry });
    } catch (error: any) {
      throw new Error(error.message);
    }

    if (laundry) {
      try {
        await Laundry.deleteOne({ _id: idLaundry });
      } catch (error) {
        throw new Error('Laundry deleting is failed');
      }
    } else {
      throw new Error('Laundry has already been deleted!');
    }
  }

  async deleteAdditionalMode(idAdditionalMode: string): Promise<void> {
    let additionalMode;
    try {
      additionalMode = await AdditionalMode.findOne({ _id: idAdditionalMode });
    } catch (error: any) {
      throw new Error(error.message);
    }

    if (additionalMode) {
      try {
        await AdditionalMode.deleteOne({ _id: idAdditionalMode });
      } catch (error) {
        throw new Error('Additional Mode deleting is failed');
      }
    } else {
      throw new Error('Additional Mode has already been deleted!');
    }
  }

  async deleteMode(idMode: string): Promise<void> {
    let mode;
    try {
      mode = await Mode.findOne({ _id: idMode });
    } catch (error: any) {
      throw new Error(error.message);
    }

    if (mode) {
      try {
        await Mode.deleteOne({ _id: idMode });
      } catch (error) {
        throw new Error('Mode deleting is failed');
      }
    } else {
      throw new Error('Mode has already been deleted!');
    }
  }

  async updateLaundry(idLaundry: string, options: any): Promise<void> {
    const laundry = await Laundry.findOne({ _id: idLaundry });
    if (laundry) {
      try {
        await Laundry.updateOne({ _id: idLaundry }, { $set: options });
      } catch (error) {
        throw new Error('Laundry updating is failed');
      }
    } else {
      throw new Error('Laundry is not exist');
    }
  }

  async updateAdditionalMode(
    idAdditionalMode: string,
    options: any
  ): Promise<void> {
    const additionalMode = await AdditionalMode.findOne({
      _id: idAdditionalMode,
    });
    if (additionalMode) {
      try {
        await AdditionalMode.updateOne(
          { _id: idAdditionalMode },
          { $set: options }
        );
      } catch (error) {
        throw new Error('Additional Mode updating is failed');
      }
    } else {
      throw new Error('Additional Mode is not exist');
    }
  }

  async updateMode(idMode: string, options: any): Promise<void> {
    const mode = await Mode.findOne({
      _id: idMode,
    });
    if (mode) {
      try {
        await Mode.updateOne({ _id: idMode }, { $set: options });
      } catch (error) {
        throw new Error('Mode updating is failed');
      }
    } else {
      throw new Error('Mode is not exist');
    }
  }

  async getLaundry(idLaundry: string): Promise<any> {
    try {
      return await Laundry.findOne({ _id: idLaundry });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAdditionalMode(idAdditionalMode: string): Promise<any> {
    try {
      return await AdditionalMode.findOne({ _id: idAdditionalMode });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getMode(idMode: string): Promise<any> {
    try {
      return await Mode.findOne({ _id: idMode });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllLaundries(): Promise<any> {
    try {
      return await Laundry.find();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllAdditionalModes(): Promise<any> {
    try {
      return await AdditionalMode.find();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllModes(): Promise<any> {
    try {
      return await Mode.find();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
