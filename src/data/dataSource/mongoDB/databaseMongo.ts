import mongoose, { Connection } from 'mongoose';
import Laundry from './models/laundry';
import AdditionalMode from './models/additionalMode';
import Mode from './models/mode';
import WashMachine from './models/washMachine';
import User from './models/user';

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

  async createWashMachine(washMachine: any): Promise<void> {
    const laundry = await this.getLaundry(washMachine.idLaundry);
    if (laundry) {
      try {
        await new WashMachine({
          _id: new mongoose.Types.ObjectId(),
          model: washMachine.model,
          manufacturer: washMachine.manufacturer,
          capacity: washMachine.capacity,
          powerUsage: washMachine.powerUsage,
          spinningSpeed: washMachine.spinningSpeed,
          laundry: washMachine.idLaundry,
        }).save();
      } catch (error) {
        throw new Error('WashMachine creating is failed');
      }
    } else {
      throw new Error('Laundry is not exist');
    }
  }

  async createUser(user: any): Promise<void> {
    try {
      await new User({
        _id: new mongoose.Types.ObjectId(),
        email: user.email,
        password: user.password,
        role: user.role,
      }).save();
    } catch (error) {
      throw new Error('User creating is failed');
    }
  }

  async deleteLaundry(idLaundry: string): Promise<void> {
    const laundry = await this.getLaundry(idLaundry);

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
    const additionalMode = await this.getAdditionalMode(idAdditionalMode);

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
    const mode = await this.getMode(idMode);

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

  async deleteWashMachine(idWashMachine: string): Promise<void> {
    const washMachine = await this.getWashMachine(idWashMachine);

    if (washMachine) {
      try {
        await WashMachine.deleteOne({ _id: idWashMachine });
      } catch (error) {
        throw new Error('WashMachine deleting is failed');
      }
    } else {
      throw new Error('WashMachine has already been deleted!');
    }
  }

  async deleteUser(idUser: string): Promise<void> {
    const user = await this.getUserById(idUser);

    if (user) {
      try {
        await User.deleteOne({ _id: idUser });
      } catch (error) {
        throw new Error('User deleting is failed');
      }
    } else {
      throw new Error('User has already been deleted!');
    }
  }

  async updateLaundry(idLaundry: string, options: any): Promise<void> {
    const laundry = await this.getLaundry(idLaundry);
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
    const additionalMode = await this.getAdditionalMode(idAdditionalMode);
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
    const mode = await this.getMode(idMode);
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

  async updateWashMachine(idWashMachine: string, options: any): Promise<void> {
    const washMachine = await this.getWashMachine(idWashMachine);
    const laundry = await this.getLaundry(options.laundry);
    if (laundry) {
      if (washMachine) {
        try {
          await WashMachine.updateOne(
            { _id: idWashMachine },
            { $set: options }
          );
        } catch (error) {
          throw new Error('WashMachine updating is failed');
        }
      } else {
        throw new Error('WashMachine is not exist');
      }
    } else {
      throw new Error('Laundry is not exist');
    }
  }

  async updateUser(idUser: string, options: any): Promise<void> {
    const user = await this.getUserById(idUser);
    if (user) {
      try {
        await User.updateOne({ _id: idUser }, { $set: options });
      } catch (error) {
        throw new Error('User updating is failed');
      }
    } else {
      throw new Error('User is not exist');
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

  async getWashMachine(idWashMachine: string): Promise<any> {
    try {
      return await WashMachine.findOne({ _id: idWashMachine });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getWashMachineWithLaundry(idWashMachine: string): Promise<any> {
    try {
      let l = await WashMachine.findOne({ _id: idWashMachine })
        .populate('laundry')
        .exec();
      console.log(l);
      return l;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserById(idUser: string): Promise<any> {
    try {
      return await User.findOne({ _id: idUser });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      return await User.findOne({ email });
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

  async getAllWashMachines(): Promise<any> {
    try {
      return await WashMachine.find();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllWashMachinesWithLaundry(): Promise<any> {
    try {
      return await WashMachine.find().populate('laundry');
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
