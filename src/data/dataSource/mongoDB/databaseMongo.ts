import mongoose, { Connection } from 'mongoose';
import Laundry from './models/laundry';
import AdditionalMode from './models/additionalMode';
import Mode from './models/mode';
import WashMachine from './models/washMachine';
import User from './models/user';
import Client from './models/client';
import Employee from './models/employee';
import RepairCompany from './models/repairCompany';
import Event from './models/event';
import path from 'path';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import Roles from '../../../controllers/utils/roles';

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

  /// Users

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
      console.log(error);
      throw new Error('User creating is failed');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);

    if (user) {
      try {
        switch (user.role) {
          case Roles.ADMIN:
            await User.deleteOne({ _id: userId });
          case Roles.CLIENT:
            await User.deleteOne({ _id: userId });
            await Client.deleteMany({ user: userId });
          case Roles.LAUNDRY:
            const laundryId = (
              await this.getLaundryByUserId(userId)
            )?._id.toString();
            await User.deleteOne({ _id: userId });
            await Laundry.deleteMany({ user: userId });
            await Employee.deleteMany({ laundry: laundryId });
            await WashMachine.deleteMany({ laundry: laundryId });
            await AdditionalMode.deleteMany({ laundry: laundryId });
            await Mode.deleteMany({ laundry: laundryId });
          case Roles.EMPLOYEE:
            await User.deleteOne({ _id: userId });
            await Employee.deleteMany({ user: userId });
          case Roles.REPAIR_COMPANY:
            await User.deleteOne({ _id: userId });
            await RepairCompany.deleteMany({ user: userId });
        }
      } catch (error) {
        throw new Error('User deleting is failed');
      }
    } else {
      throw new Error('User has already been deleted!');
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

  async getUserById(userId: string): Promise<any> {
    try {
      return await User.findOne({ _id: userId });
    } catch (error: any) {
      throw new Error('User is not exists');
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      return await User.findOne({ email });
    } catch (error: any) {
      throw new Error('User is not exists');
    }
  }

  /// Laundries

  async createLaundry(laundry: any): Promise<string> {
    try {
      const createdLaundry = await new Laundry({
        _id: new mongoose.Types.ObjectId(),
        name: laundry.name,
        address: laundry.address,
        maxAmount: laundry.maxAmount,
        phone: laundry.phone,
        user: laundry.userId,
      }).save();
      return createdLaundry?._id.toString();
    } catch (error) {
      throw new Error('Laundry creating is failed');
    }
  }

  async getLaundryByUserId(userId: string): Promise<any> {
    try {
      return await Laundry.findOne({ user: userId }).populate('user');
    } catch (error: any) {
      throw new Error('Laundry is not exists');
    }
  }

  async getLaundryById(laundryId: string): Promise<any> {
    try {
      return await Laundry.findOne({ _id: laundryId }).populate('user');
    } catch (error: any) {
      throw new Error('Laundry is not exists');
    }
  }

  async updateLaundry(laundryId: string, options: any): Promise<void> {
    const laundry = await this.getLaundry(laundryId);
    if (laundry) {
      try {
        await User.updateOne(
          { _id: options.userId },
          { $set: { email: options.email } }
        );
        await Laundry.updateOne(
          { _id: laundryId },
          {
            $set: {
              name: options.name,
              address: options.address,
              phone: options.phone,
              maxAmount: options.maxAmount,
            },
          }
        );
      } catch (error) {
        throw new Error('Laundry updating is failed');
      }
    } else {
      throw new Error('Laundry is not exist');
    }
  }

  async getLaundry(laundryId: string): Promise<any> {
    try {
      return await Laundry.findOne({ _id: laundryId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getLaundries(page: number, size: number): Promise<any> {
    try {
      return await Laundry.find()
        .populate('user')
        .skip(page * size)
        .limit(size);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getLaundriesAmount(): Promise<number> {
    try {
      return await Laundry.find().count();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /// Clients

  async createClient(client: any): Promise<string> {
    try {
      const createdClient = await new Client({
        _id: new mongoose.Types.ObjectId(),
        name: client.name,
        phone: client.phone,
        bonuses: client.bonuses,
        user: client.userId,
      }).save();
      return createdClient?._id.toString();
    } catch (error) {
      throw new Error('Client creating is failed');
    }
  }

  async getClientByUserId(userId: string): Promise<any> {
    try {
      return await Client.findOne({ user: userId }).populate('user');
    } catch (error: any) {
      throw new Error('Client is not exists');
    }
  }

  async updateClient(
    clientId: string,
    userOptions: any,
    options: any
  ): Promise<void> {
    try {
      await User.updateOne(
        { _id: userOptions.userId },
        { $set: { email: userOptions.email } }
      );
      await Client.updateOne(
        { _id: clientId },
        {
          $set: options,
        }
      );
    } catch (error) {
      throw new Error('Client updating is failed');
    }
  }

  async getClients(page: number, size: number): Promise<any> {
    try {
      return await Client.find()
        .populate('user')
        .skip(page * size)
        .limit(size);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getClientsAmount(): Promise<number> {
    try {
      return await Employee.find().count();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /// Employees

  async createEmployee(employee: any): Promise<string> {
    try {
      const createdEmployee = await new Employee({
        _id: new mongoose.Types.ObjectId(),
        name: employee.name,
        phone: employee.phone,
        birthday: employee.birthday,
        laundry: employee.laundryId,
        user: employee.userId,
      }).save();
      return createdEmployee?._id.toString();
    } catch (error) {
      throw new Error('Employee creating is failed');
    }
  }

  async getEmployeeByUserId(userId: string): Promise<any> {
    try {
      return await Employee.findOne({ user: userId }).populate('user laundry');
    } catch (error: any) {
      throw new Error('Client is not exists');
    }
  }

  async updateEmployee(employeeId: string, options: any): Promise<void> {
    try {
      await User.updateOne(
        { _id: options.userId },
        { $set: { email: options.email } }
      );
      await Employee.updateOne(
        { _id: employeeId },
        {
          $set: {
            name: options.name,
            phone: options.phone,
            birthday: options.birthday,
          },
        }
      );
    } catch (error) {
      throw new Error('Employee updating is failed');
    }
  }

  async getEmployee(employeeId: string): Promise<any> {
    try {
      return await Employee.findOne({ _id: employeeId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getEmployees(
    laundryId: string,
    page: number,
    size: number
  ): Promise<any> {
    try {
      return await Employee.find({ laundry: laundryId })
        .populate('user')
        .skip(page * size)
        .limit(size);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getEmployeesAmount(laundryId: string): Promise<number> {
    try {
      return await Employee.find({ laundry: laundryId }).count();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /// Repair Companies

  async createRepairCompany(repairCompany: any): Promise<string> {
    try {
      const createdRepairCompany = await new RepairCompany({
        _id: new mongoose.Types.ObjectId(),
        name: repairCompany.name,
        phone: repairCompany.phone,
        address: repairCompany.address,
        user: repairCompany.userId,
      }).save();
      return createdRepairCompany?._id.toString();
    } catch (error) {
      throw new Error('Repair Company creating is failed');
    }
  }

  async getRepairCompanyByUserId(userId: string): Promise<any> {
    try {
      return await RepairCompany.findOne({ user: userId }).populate('user');
    } catch (error: any) {
      throw new Error('Repair company is not exists');
    }
  }

  /// Wash machines

  async createWashMachine(washMachine: any): Promise<string> {
    try {
      const createdWashMachine = await new WashMachine({
        _id: new mongoose.Types.ObjectId(),
        model: washMachine.model,
        manufacturer: washMachine.manufacturer,
        capacity: washMachine.capacity,
        powerUsage: washMachine.powerUsage,
        spinningSpeed: washMachine.spinningSpeed,
        laundry: washMachine.laundryId,
        isWorking: washMachine.isWorking,
        isWashing: washMachine.isWashing,
        maxTime: washMachine.maxTime,
        currentTime: washMachine.currentTime,
      }).save();
      return createdWashMachine?._id.toString();
    } catch (error) {
      throw new Error('WashMachine creating is failed');
    }
  }

  async updateWashMachine(washMachine: any): Promise<void> {
    try {
      await WashMachine.updateMany(
        { _id: washMachine.washMachineId },
        {
          $set: {
            model: washMachine.model,
            manufacturer: washMachine.manufacturer,
            capacity: washMachine.capacity,
            powerUsage: washMachine.powerUsage,
            spinningSpeed: washMachine.spinningSpeed,
            isWorking: washMachine.isWorking,
            isWashing: washMachine.isWashing,
            maxTime: washMachine.maxTime,
            currentTime: washMachine.currentTime,
          },
        }
      );
    } catch (error) {
      throw new Error('WashMachine updating is failed');
    }
  }

  async deleteWashMachine(washMachineId: string): Promise<void> {
    try {
      await WashMachine.deleteOne({ _id: washMachineId });
    } catch (error) {
      throw new Error('WashMachine deleting is failed');
    }
  }

  async getWashMachineById(washMachineId: string): Promise<any> {
    try {
      return await WashMachine.findOne({ _id: washMachineId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getWashMachines(
    laundryId: string,
    page: number,
    size: number
  ): Promise<any> {
    try {
      return await WashMachine.find({ laundry: laundryId })
        .skip(page * size)
        .limit(size);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getWashMachinesAmount(laundryId: string): Promise<number> {
    try {
      return await WashMachine.find({ laundry: laundryId }).count();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /// Additional Modes

  async createAdditionalMode(additionalMode: any): Promise<string> {
    try {
      const createdAdditionalMode = await new AdditionalMode({
        _id: new mongoose.Types.ObjectId(),
        name: additionalMode.name,
        time: additionalMode.time,
        costs: additionalMode.costs,
        laundry: additionalMode.laundryId,
      }).save();
      return createdAdditionalMode?._id.toString();
    } catch (error) {
      throw new Error('Additional Mode creating is failed');
    }
  }

  async updateAdditionalMode(additionalMode: any): Promise<void> {
    try {
      await AdditionalMode.updateOne(
        { _id: additionalMode.additionalModeId },
        {
          $set: {
            name: additionalMode.name,
            time: additionalMode.time,
            costs: additionalMode.costs,
          },
        }
      );
    } catch (error) {
      throw new Error('Additional Mode updating is failed');
    }
  }

  async deleteAdditionalMode(additionalModeId: string): Promise<void> {
    try {
      await AdditionalMode.deleteOne({ _id: additionalModeId });
    } catch (error) {
      throw new Error('Additional Mode deleting is failed');
    }
  }

  async getAdditionalMode(additionalModeId: string): Promise<any> {
    try {
      return await AdditionalMode.findOne({ _id: additionalModeId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAdditionalModes(laundryId: string): Promise<any> {
    try {
      return await AdditionalMode.find({ laundry: laundryId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAdditionalModesAmount(laundryId: string): Promise<number> {
    try {
      return await AdditionalMode.find({ laundry: laundryId }).count();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /// Modes

  async createMode(mode: any): Promise<string> {
    try {
      const createdMode = await new Mode({
        _id: new mongoose.Types.ObjectId(),
        name: mode.name,
        time: mode.time,
        costs: mode.costs,
        laundry: mode.laundryId,
      }).save();
      return createdMode?._id.toString();
    } catch (error) {
      throw new Error('Mode creating is failed');
    }
  }

  async updateMode(mode: any): Promise<void> {
    try {
      await Mode.updateOne(
        { _id: mode.modeId },
        {
          $set: {
            name: mode.name,
            time: mode.time,
            costs: mode.costs,
          },
        }
      );
    } catch (error) {
      throw new Error('Mode updating is failed');
    }
  }

  async deleteMode(modeId: string): Promise<void> {
    try {
      await Mode.deleteOne({ _id: modeId });
    } catch (error) {
      throw new Error('Mode deleting is failed');
    }
  }

  async getMode(modeId: string): Promise<any> {
    try {
      return await Mode.findOne({ _id: modeId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getModes(laundryId: string): Promise<any> {
    try {
      return await Mode.find({ laundry: laundryId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getModesAmount(laundryId: string): Promise<number> {
    try {
      return await Mode.find({ laundry: laundryId }).count();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // async createMode(mode: any): Promise<void> {
  //   try {
  //     await new Mode({
  //       _id: new mongoose.Types.ObjectId(),
  //       name: mode.name,
  //       time: mode.time,
  //       costs: mode.costs,
  //     }).save();
  //   } catch (error) {
  //     throw new Error('Mode creating is failed');
  //   }
  // }

  // private parseEmployeeError(user: any, laundry: any): string {
  //   let entity = '';
  //   if (user == null && laundry == null) {
  //     entity = 'User and laundry are';
  //   } else if (user == null) {
  //     entity = 'User is';
  //   } else if (laundry == null) {
  //     entity = 'Laundry is';
  //   }
  //   return entity + ' not exist';
  // }

  // async createEvent(event: any): Promise<string> {
  //   const washMachine = await this.getWashMachine(event.washMachineId);
  //   const mode = await this.getMode(event.modeId);
  //   const additionalMode =
  //     event.additionalModeId == null
  //       ? true
  //       : await this.getAdditionalMode(event.additionalModeId);
  //   try {
  //     if (washMachine && mode && additionalMode) {
  //       const createdEvent = new Event({
  //         _id: new mongoose.Types.ObjectId(),
  //         washMachine: event.washMachineId,
  //         temperature: event.temperature,
  //         spinning: event.spinning,
  //         mode: event.modeId,
  //         additionalMode: event.additionalModeId,
  //         client: event.clientId,
  //       });

  //       await createdEvent.save();
  //       return createdEvent?._id.toString();
  //     }

  //     throw Error();
  //   } catch (error) {
  //     throw new Error('Event creating is failed');
  //   }
  // }

  // async deleteLaundry(laundryId: string): Promise<void> {
  //   const laundry = await this.getLaundry(laundryId);

  //   if (laundry) {
  //     try {
  //       const employees = await this.getAllEmployees();

  //       for (let i = 0; i < employees.length; i++) {
  //         await this.deleteEmployee(employees[i]._id.toString());
  //       }

  //       await Laundry.deleteOne({ _id: laundryId });
  //       await WashMachine.deleteMany({ laundry: laundryId });
  //     } catch (error) {
  //       throw new Error('Laundry deleting is failed');
  //     }
  //   } else {
  //     throw new Error('Laundry has already been deleted!');
  //   }
  // }

  // async deleteMode(modeId: string): Promise<void> {
  //   const mode = await this.getMode(modeId);

  //   if (mode) {
  //     try {
  //       await Mode.deleteOne({ _id: modeId });
  //     } catch (error) {
  //       throw new Error('Mode deleting is failed');
  //     }
  //   } else {
  //     throw new Error('Mode has already been deleted!');
  //   }
  // }

  // async deleteWashMachine(washMachineId: string): Promise<void> {
  //   const washMachine = await this.getWashMachine(washMachineId);

  //   if (washMachine) {
  //     try {
  //       await WashMachine.deleteOne({ _id: washMachineId });
  //     } catch (error) {
  //       throw new Error('WashMachine deleting is failed');
  //     }
  //   } else {
  //     throw new Error('WashMachine has already been deleted!');
  //   }
  // }

  // async deleteClient(clientId: string): Promise<void> {
  //   const client = await this.getClient(clientId);
  //   if (client) {
  //     await this.deleteUser(client.user);
  //     try {
  //       await Client.deleteOne({ _id: clientId });
  //     } catch (error) {
  //       throw new Error('Client deleting is failed');
  //     }
  //   } else {
  //     throw new Error('Client has already been deleted!');
  //   }
  // }

  // async deleteEmployee(employeeId: string): Promise<void> {
  //   const employee = await this.getEmployee(employeeId);
  //   if (employee) {
  //     await this.deleteUser(employee.user);
  //     try {
  //       await Employee.deleteOne({ _id: employeeId });
  //     } catch (error) {
  //       throw new Error('Employee deleting is failed');
  //     }
  //   } else {
  //     throw new Error('Employee has already been deleted!');
  //   }
  // }

  // async deleteEvent(eventId: string): Promise<void> {
  //   const event = await this.getEvent(eventId);
  //   if (event) {
  //     try {
  //       await Event.deleteOne({ _id: event });
  //     } catch (error) {
  //       throw new Error('Event deleting is failed');
  //     }
  //   } else {
  //     throw new Error('Event has already been deleted!');
  //   }
  // }

  // async updateMode(modeId: string, options: any): Promise<void> {
  //   const mode = await this.getMode(modeId);
  //   if (mode) {
  //     try {
  //       await Mode.updateOne({ _id: modeId }, { $set: options });
  //     } catch (error) {
  //       throw new Error('Mode updating is failed');
  //     }
  //   } else {
  //     throw new Error('Mode is not exist');
  //   }
  // }

  // async updateWashMachine(washMachineId: string, options: any): Promise<void> {
  //   const washMachine = await this.getWashMachine(washMachineId);

  //   if (washMachine) {
  //     const laundry = await this.laundryProps(options.laundry);
  //     if (laundry) {
  //       try {
  //         await WashMachine.updateOne(
  //           { _id: washMachineId },
  //           { $set: options }
  //         );
  //       } catch (error) {
  //         throw new Error('WashMachine updating is failed');
  //       }
  //     } else {
  //       throw new Error('Laundry is not exist');
  //     }
  //   } else {
  //     throw new Error('WashMachine is not exist');
  //   }
  // }

  // private async laundryProps(optionsLaundry: any): Promise<any> {
  //   let laundry;
  //   if (optionsLaundry == undefined) {
  //     laundry = true;
  //   } else {
  //     laundry = await this.getLaundry(optionsLaundry);
  //   }
  //   return laundry;
  // }

  // async updateClient(clientId: string, options: any): Promise<void> {
  //   const client = await this.getClient(clientId);

  //   if (client) {
  //     const user = await this.userProps(options.user);
  //     if (user) {
  //       try {
  //         await Client.updateOne({ _id: clientId }, { $set: options });
  //       } catch (error) {
  //         throw new Error('Client updating is failed');
  //       }
  //     } else {
  //       throw new Error('User is not exist');
  //     }
  //   } else {
  //     throw new Error('Client is not exist');
  //   }
  // }

  // private async userProps(optionUser: any): Promise<any> {
  //   let user;
  //   if (optionUser == undefined) {
  //     user = true;
  //   } else {
  //     user = await this.getUserById(optionUser);
  //   }
  //   return user;
  // }

  // async updateEmployee(employeeId: string, options: any): Promise<void> {
  //   const employee = await this.getEmployee(employeeId);

  //   if (employee) {
  //     const user = await this.userProps(options.user);
  //     const laundry = await this.laundryProps(options.laundry);

  //     if (user && laundry) {
  //       try {
  //         await Employee.updateOne({ _id: employee }, { $set: options });
  //       } catch (error) {
  //         throw new Error('Employee updating is failed');
  //       }
  //     } else {
  //       throw new Error(this.parseEmployeeError(user, laundry));
  //     }
  //   } else {
  //     throw new Error('Employee is not exist');
  //   }
  // }

  // async updateEvent(eventId: string, options: any): Promise<void> {
  //   const event = await this.getEvent(eventId);
  //   if (event) {
  //     const client =
  //       options.client == undefined
  //         ? true
  //         : await this.getClient(options.client);
  //     if (client) {
  //       try {
  //         await Event.updateOne(
  //           { _id: eventId },
  //           { $set: options },
  //           { upsert: true }
  //         );
  //       } catch (error) {
  //         throw new Error('Event updating is failed');
  //       }
  //     } else {
  //       throw new Error('Client is not exist');
  //     }
  //   } else {
  //     throw new Error('Event is not exist');
  //   }
  // }

  // async getMode(modeId: string): Promise<any> {
  //   try {
  //     return await Mode.findOne({ _id: modeId });
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getWashMachine(washMachineId: string): Promise<any> {
  //   try {
  //     return await WashMachine.findOne({ _id: washMachineId });
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }
  // async getWashMachineWithLaundry(washMachineId: string): Promise<any> {
  //   try {
  //     return await WashMachine.findOne({ _id: washMachineId })
  //       .populate('laundry')
  //       .exec();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getClient(clientId: string): Promise<any> {
  //   try {
  //     return await Client.findOne({ _id: clientId });
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getClientByUserId(userId: string): Promise<any> {
  //   try {
  //     const client = await Client.findOne({ user: userId });
  //     console.log(client);
  //     return client;
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getClientWithInfo(clientId: string): Promise<any> {
  //   try {
  //     return await Client.findOne({ _id: clientId }).populate('user').exec();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getEmployeeWithInfo(employeeId: string): Promise<any> {
  //   try {
  //     return await Employee.findOne({ _id: employeeId })
  //       .populate('user laundry')
  //       .exec();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getAllLaundries(): Promise<any> {
  //   try {
  //     return await Laundry.find();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getAllAdditionalModes(): Promise<any> {
  //   try {
  //     return await AdditionalMode.find();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }
  // async getAllModes(): Promise<any> {
  //   try {
  //     return await Mode.find();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getAllWashMachines(): Promise<any> {
  //   try {
  //     return await WashMachine.find();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getAllWashMachinesWithLaundry(): Promise<any> {
  //   try {
  //     return await WashMachine.find().populate('laundry');
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getAllClients(): Promise<any> {
  //   try {
  //     return await Client.find();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }
  // async getAllClientsWithInfo(): Promise<any> {
  //   try {
  //     return await Client.find().populate('user');
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getAllEmployees(): Promise<any> {
  //   try {
  //     return await Employee.find();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }
  // async getAllEmployeesWithInfo(): Promise<any> {
  //   try {
  //     return await Employee.find().populate('user laundry').exec();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getEvent(eventId: string): Promise<any> {
  //   try {
  //     return await Event.findOne({ _id: eventId });
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getEventWithInfo(eventId: string): Promise<any> {
  //   try {
  //     return await Event.findOne({ _id: eventId }).populate(
  //       'washMachine mode additionalMode client'
  //     );
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getAllEvents(): Promise<any> {
  //   try {
  //     return await Event.find();
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async getAllEventsWithInfo(): Promise<any> {
  //   try {
  //     return await Event.find().populate(
  //       'washMachine mode additionalMode client'
  //     );
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  backupMongo(): ChildProcessWithoutNullStreams {
    const archivePath = `backup/${Date.now()}.gzip`;
    return spawn('mongodump', [
      `${process.env.URL}`,
      `--archive=./${archivePath}`,
      '--gzip',
    ]);
  }

  restoreMongo(backup: string): ChildProcessWithoutNullStreams {
    const archivePath = `backup/${backup}.gzip`;
    return spawn('mongorestore', [
      `${process.env.URL}`,
      `--archive=./${archivePath}`,
      '--gzip',
      '--drop',
    ]);
  }
}
