import mongoose, { Connection } from 'mongoose';
import Laundry from './models/laundry';
import AdditionalMode from './models/additionalMode';
import Mode from './models/mode';
import WashMachine from './models/washMachine';
import User from './models/user';
import Client from './models/client';

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
    const laundry = await this.getLaundry(washMachine.laundryId);
    if (laundry) {
      try {
        await new WashMachine({
          _id: new mongoose.Types.ObjectId(),
          model: washMachine.model,
          manufacturer: washMachine.manufacturer,
          capacity: washMachine.capacity,
          powerUsage: washMachine.powerUsage,
          spinningSpeed: washMachine.spinningSpeed,
          laundry: washMachine.laundryId,
        }).save();
      } catch (error) {
        throw new Error('WashMachine creating is failed');
      }
    } else {
      throw new Error('Laundry is not exist');
    }
  }

  async createClient(client: any): Promise<void> {
    const user = await this.getUserById(client.userId);
    if (user) {
      try {
        await new Client({
          _id: new mongoose.Types.ObjectId(),
          name: client.name,
          surname: client.surname,
          phone: client.phone,
          user: client.userId,
        });
      } catch (error) {
        throw new Error('Client creating is failed');
      }
    } else {
      throw new Error('User is not exist');
    }
  }

  async createUser(user: any): Promise<string> {
    try {
      const createdUser = await new User({
        _id: new mongoose.Types.ObjectId(),
        email: user.email,
        password: user.password,
        role: user.role,
      }).save();
      return createdUser?._id.toString();
    } catch (error) {
      throw new Error('User creating is failed');
    }
  }

  async deleteLaundry(laundryId: string): Promise<void> {
    const laundry = await this.getLaundry(laundryId);

    if (laundry) {
      try {
        await Laundry.deleteOne({ _id: laundryId });
      } catch (error) {
        throw new Error('Laundry deleting is failed');
      }
    } else {
      throw new Error('Laundry has already been deleted!');
    }
  }

  async deleteAdditionalMode(additionalModeId: string): Promise<void> {
    const additionalMode = await this.getAdditionalMode(additionalModeId);

    if (additionalMode) {
      try {
        await AdditionalMode.deleteOne({ _id: additionalModeId });
      } catch (error) {
        throw new Error('Additional Mode deleting is failed');
      }
    } else {
      throw new Error('Additional Mode has already been deleted!');
    }
  }

  async deleteMode(modeId: string): Promise<void> {
    const mode = await this.getMode(modeId);

    if (mode) {
      try {
        await Mode.deleteOne({ _id: modeId });
      } catch (error) {
        throw new Error('Mode deleting is failed');
      }
    } else {
      throw new Error('Mode has already been deleted!');
    }
  }

  async deleteWashMachine(washMachineId: string): Promise<void> {
    const washMachine = await this.getWashMachine(washMachineId);

    if (washMachine) {
      try {
        await WashMachine.deleteOne({ _id: washMachineId });
      } catch (error) {
        throw new Error('WashMachine deleting is failed');
      }
    } else {
      throw new Error('WashMachine has already been deleted!');
    }
  }

  async deleteClient(clientId: string): Promise<void> {
    const client = await this.getClient(clientId);
    await this.deleteUser(client.userId);

    if (client) {
      try {
        await Client.deleteOne({ _id: clientId });
      } catch (error) {
        throw new Error('Client deleting is failed');
      }
    } else {
      throw new Error('Client has already been deleted!');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);

    if (user) {
      try {
        await User.deleteOne({ _id: userId });
      } catch (error) {
        throw new Error('User deleting is failed');
      }
    } else {
      throw new Error('User has already been deleted!');
    }
  }

  async updateLaundry(laundryId: string, options: any): Promise<void> {
    const laundry = await this.getLaundry(laundryId);
    if (laundry) {
      try {
        await Laundry.updateOne({ _id: laundryId }, { $set: options });
      } catch (error) {
        throw new Error('Laundry updating is failed');
      }
    } else {
      throw new Error('Laundry is not exist');
    }
  }

  async updateAdditionalMode(
    additionalModeId: string,
    options: any
  ): Promise<void> {
    const additionalMode = await this.getAdditionalMode(additionalModeId);
    if (additionalMode) {
      try {
        await AdditionalMode.updateOne(
          { _id: additionalModeId },
          { $set: options }
        );
      } catch (error) {
        throw new Error('Additional Mode updating is failed');
      }
    } else {
      throw new Error('Additional Mode is not exist');
    }
  }

  async updateMode(modeId: string, options: any): Promise<void> {
    const mode = await this.getMode(modeId);
    if (mode) {
      try {
        await Mode.updateOne({ _id: modeId }, { $set: options });
      } catch (error) {
        throw new Error('Mode updating is failed');
      }
    } else {
      throw new Error('Mode is not exist');
    }
  }

  async updateWashMachine(washMachineId: string, options: any): Promise<void> {
    const washMachine = await this.getWashMachine(washMachineId);
    let laundry;
    if (options.laundry == undefined) {
      laundry = true;
    } else {
      laundry = await this.getLaundry(options.laundry);
    }
    if (laundry) {
      if (washMachine) {
        try {
          await WashMachine.updateOne(
            { _id: washMachineId },
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

  async updateClient(clientId: string, options: any): Promise<void> {
    const client = await this.getClient(clientId);
    let user;
    if (options.user == undefined) {
      user = true;
    } else {
      user = await this.getUserById(client.user);
    }

    if (user) {
      if (client) {
        try {
          await Client.updateOne({ _id: clientId }, { $set: options });
        } catch (error) {
          throw new Error('WashMachine updating is failed');
        }
      } else {
        throw new Error('Client is not exist');
      }
    } else {
      throw new Error('User is not exist');
    }
  }

  async updateUser(userId: string, options: any): Promise<void> {
    const user = await this.getUserById(userId);
    if (user) {
      try {
        await User.updateOne({ _id: userId }, { $set: options });
      } catch (error) {
        throw new Error('User updating is failed');
      }
    } else {
      throw new Error('User is not exist');
    }
  }

  async getLaundry(laundryId: string): Promise<any> {
    try {
      return await Laundry.findOne({ _id: laundryId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAdditionalMode(additionalModeId: string): Promise<any> {
    try {
      return await AdditionalMode.findOne({ _id: additionalModeId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getMode(modeId: string): Promise<any> {
    try {
      return await Mode.findOne({ _id: modeId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getWashMachine(washMachineId: string): Promise<any> {
    try {
      return await WashMachine.findOne({ _id: washMachineId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getWashMachineWithLaundry(washMachineId: string): Promise<any> {
    try {
      return await WashMachine.findOne({ _id: washMachineId })
        .populate('laundry')
        .exec();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getClient(clientId: string): Promise<any> {
    try {
      return await Client.findOne({ _id: clientId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getClientWithInfo(clientId: string): Promise<any> {
    try {
      return await Client.findOne({ _id: clientId }).populate('user').exec();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      return await User.findOne({ _id: userId });
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

  async getAllClients(): Promise<any> {
    try {
      return await Client.find();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllClientsWithInfo(): Promise<any> {
    try {
      return await Client.find().populate('user');
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
