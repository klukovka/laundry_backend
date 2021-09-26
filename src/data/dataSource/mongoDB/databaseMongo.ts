import mongoose, { Connection } from 'mongoose';
import Laundry from './models/laundry';
import AdditionalMode from './models/additionalMode';
import Mode from './models/mode';
import WashMachine from './models/washMachine';
import User from './models/user';
import Client from './models/client';
import Employee from './models/employee';
import Event from './models/event';

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
        }).save();
      } catch (error) {
        throw new Error('Client creating is failed');
      }
    } else {
      throw new Error('User is not exist');
    }
  }

  async createEmployee(employee: any): Promise<void> {
    const user = await this.getUserById(employee.userId);
    const laundry = await this.getLaundry(employee.laundryId);
    if (user && laundry) {
      try {
        await new Employee({
          _id: new mongoose.Types.ObjectId(),
          name: employee.name,
          surname: employee.surname,
          phone: employee.phone,
          birthday: employee.birthday,
          laundry: employee.laundryId,
          user: employee.userId,
        }).save();
      } catch (error) {
        throw new Error('Employee creating is failed');
      }
    } else {
      throw new Error(this.parseEmployeeError(user, laundry));
    }
  }

  private parseEmployeeError(user: any, laundry: any): string {
    let entity = '';
    if (user == null && laundry == null) {
      entity = 'User and laundry are';
    } else if (user == null) {
      entity = 'User is';
    } else if (laundry == null) {
      entity = 'Laundry is';
    }
    return entity + ' not exist';
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

  async createEvent(event: any): Promise<string> {
    const washMachine = this.getWashMachine(event.washMachineId);
    const mode = this.getMode(event.modeId);
    const additionalMode =
      event.additionalModeId == null
        ? true
        : this.getAdditionalMode(event.additionalModeId);
    try {
      if (washMachine && mode && additionalMode) {
        const createdEvent = new Event({
          _id: new mongoose.Types.ObjectId(),
          washMachine: event.washMachineId,
          temperature: event.temperature,
          spinning: event.spinning,
          mode: event.modeId,
          additionalMode: event.additionalModeId,
          client: event.clientId,
        });

        await createdEvent.save();
        return createdEvent?._id.toString();
      }

      throw Error();
    } catch (error) {
      throw new Error('Event creating is failed');
    }
  }

  async deleteLaundry(laundryId: string): Promise<void> {
    const laundry = await this.getLaundry(laundryId);

    if (laundry) {
      try {
        const employees = await this.getAllEmployees();

        for (let i = 0; i < employees.length; i++) {
          await this.deleteEmployee(employees[i]._id.toString());
        }

        await Laundry.deleteOne({ _id: laundryId });
        await WashMachine.deleteMany({ laundry: laundryId });
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
    if (client) {
      await this.deleteUser(client.user);
      try {
        await Client.deleteOne({ _id: clientId });
      } catch (error) {
        throw new Error('Client deleting is failed');
      }
    } else {
      throw new Error('Client has already been deleted!');
    }
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    const employee = await this.getEmployee(employeeId);
    if (employee) {
      await this.deleteUser(employee.user);
      try {
        await Employee.deleteOne({ _id: employeeId });
      } catch (error) {
        throw new Error('Employee deleting is failed');
      }
    } else {
      throw new Error('Employee has already been deleted!');
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    const event = await this.getEvent(eventId);
    if (event) {
      try {
        await Event.deleteOne({ _id: event });
      } catch (error) {
        throw new Error('Event deleting is failed');
      }
    } else {
      throw new Error('Event has already been deleted!');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);

    if (user) {
      try {
        if (user.role == 'client') {
          await Client.deleteMany({ user: userId });
        }
        if (user.role == 'employee') {
          await Employee.deleteMany({ user: userId });
        }
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

    if (washMachine) {
      const laundry = await this.laundryProps(options.laundry);
      if (laundry) {
        try {
          await WashMachine.updateOne(
            { _id: washMachineId },
            { $set: options }
          );
        } catch (error) {
          throw new Error('WashMachine updating is failed');
        }
      } else {
        throw new Error('Laundry is not exist');
      }
    } else {
      throw new Error('WashMachine is not exist');
    }
  }

  private async laundryProps(optionsLaundry: any): Promise<any> {
    let laundry;
    if (optionsLaundry == undefined) {
      laundry = true;
    } else {
      laundry = await this.getLaundry(optionsLaundry);
    }
    return laundry;
  }

  async updateClient(clientId: string, options: any): Promise<void> {
    const client = await this.getClient(clientId);

    if (client) {
      const user = await this.userProps(options.user);
      if (user) {
        try {
          await Client.updateOne({ _id: clientId }, { $set: options });
        } catch (error) {
          throw new Error('Client updating is failed');
        }
      } else {
        throw new Error('User is not exist');
      }
    } else {
      throw new Error('Client is not exist');
    }
  }

  private async userProps(optionUser: any): Promise<any> {
    let user;
    if (optionUser == undefined) {
      user = true;
    } else {
      user = await this.getUserById(optionUser);
    }
    return user;
  }

  async updateEmployee(employeeId: string, options: any): Promise<void> {
    const employee = await this.getEmployee(employeeId);

    if (employee) {
      const user = await this.userProps(options.user);
      const laundry = await this.laundryProps(options.laundry);

      if (user && laundry) {
        try {
          await Employee.updateOne({ _id: employee }, { $set: options });
        } catch (error) {
          throw new Error('Employee updating is failed');
        }
      } else {
        throw new Error(this.parseEmployeeError(user, laundry));
      }
    } else {
      throw new Error('Employee is not exist');
    }
  }

  async updateEvent(eventId: string, options: any): Promise<void> {
    const event = await this.getEvent(eventId);
    if (event) {
      const client =
        options.client == undefined
          ? true
          : await this.getClient(options.client);
      if (client) {
        try {
          await Event.updateOne(
            { _id: eventId },
            { $set: options },
            { upsert: true }
          );
        } catch (error) {
          throw new Error('Event updating is failed');
        }
      } else {
        throw new Error('Client is not exist');
      }
    } else {
      throw new Error('Event is not exist');
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

  async getEmployee(employeeId: string): Promise<any> {
    try {
      return await Employee.findOne({ _id: employeeId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getEmployeeWithInfo(employeeId: string): Promise<any> {
    try {
      return await Employee.findOne({ _id: employeeId })
        .populate('user laundry')
        .exec();
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

  async getAllEmployees(): Promise<any> {
    try {
      return await Employee.find();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllEmployeesWithInfo(): Promise<any> {
    try {
      return await Employee.find().populate('user laundry').exec();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getEvent(eventId: string): Promise<any> {
    try {
      return await Event.findOne({ _id: eventId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getEventWithInfo(eventId: string): Promise<any> {
    try {
      return await Event.findOne({ _id: eventId }).populate(
        'washmachine mode additionalmode client'
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllEvents(): Promise<any> {
    try {
      return await Event.find();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllEventsWithInfo(): Promise<any> {
    try {
      return await Event.find().populate(
        'washmachine mode additionalmode client'
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
