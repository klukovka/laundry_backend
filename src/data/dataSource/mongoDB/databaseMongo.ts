import mongoose, { Connection } from "mongoose";
import Laundry from "./models/laundry";
import AdditionalMode from "./models/additionalMode";
import Mode from "./models/mode";
import WashMachine from "./models/washMachine";
import User from "./models/user";
import Client from "./models/client";
import Employee from "./models/employee";
import RepairCompany from "./models/repairCompany";
import RepairProduct from "./models/repairProduct";
import RepairEvent from "./models/repairEvent";
import Event from "./models/event";
import path from "path";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import Roles from "../../../controllers/utils/roles";

export class DatabaseMongo {
  private static db: DatabaseMongo;
  private connection: Connection | null = null;

  private constructor() {
    const connectionString = process.env.CONNECTION || "";
    mongoose.Promise = global.Promise;

    mongoose
      .connect(connectionString)
      .then(() => console.log("MongoDB connection opened!"));

    this.connection = mongoose.connection;
    this.connection.on(
      "error",
      console.error.bind(console, "MongoDB connection error: ")
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
      .then(() => console.log("MongoDB connection closed!"));
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
      throw new Error("User creating is failed");
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.getUserById(userId);

    if (user) {
      try {
        switch (user.role) {
          case Roles.ADMIN:
          case Roles.IOT:
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
        throw new Error("User deleting is failed");
      }
    } else {
      throw new Error("User has already been deleted!");
    }
  }

  async updateUser(userId: string, options: any): Promise<void> {
    const user = await this.getUserById(userId);
    if (user) {
      try {
        await User.updateOne({ _id: userId }, { $set: options });
      } catch (error) {
        throw new Error("User updating is failed");
      }
    } else {
      throw new Error("User is not exist");
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      return await User.findOne({ _id: userId });
    } catch (error: any) {
      throw new Error("User is not exists");
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      return await User.findOne({ email });
    } catch (error: any) {
      throw new Error("User is not exists");
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
      throw new Error("Laundry creating is failed");
    }
  }

  async getLaundryByUserId(userId: string): Promise<any> {
    try {
      return await Laundry.findOne({ user: userId }).populate("user");
    } catch (error: any) {
      throw new Error("Laundry is not exists");
    }
  }

  async getLaundryById(laundryId: string): Promise<any> {
    try {
      return await Laundry.findOne({ _id: laundryId }).populate("user");
    } catch (error: any) {
      throw new Error("Laundry is not exists");
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
        throw new Error("Laundry updating is failed");
      }
    } else {
      throw new Error("Laundry is not exist");
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
        .populate("user")
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
      throw new Error("Client creating is failed");
    }
  }

  async getClientByUserId(userId: string): Promise<any> {
    try {
      return await Client.findOne({ user: userId }).populate("user");
    } catch (error: any) {
      throw new Error("Client is not exists");
    }
  }

  async getClientById(clientId: string): Promise<any> {
    try {
      return await Client.findOne({ _id: clientId }).populate("user");
    } catch (error: any) {
      throw new Error("Client is not exists");
    }
  }

  async updateClient(
    clientId: string,
    userOptions: any,
    options: any
  ): Promise<void> {
    try {
      if (userOptions != null) {
        await User.updateOne(
          { _id: userOptions.userId },
          { $set: { email: userOptions.email } }
        );
      }
      await Client.updateOne(
        { _id: clientId },
        {
          $set: options,
        }
      );
    } catch (error) {
      throw new Error("Client updating is failed");
    }
  }

  async getClients(page: number, size: number): Promise<any> {
    try {
      return await Client.find()
        .populate("user")
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
      throw new Error("Employee creating is failed");
    }
  }

  async getEmployeeByUserId(userId: string): Promise<any> {
    try {
      return await Employee.findOne({ user: userId }).populate("user laundry");
    } catch (error: any) {
      throw new Error("Client is not exists");
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
      throw new Error("Employee updating is failed");
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
        .populate("user")
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

  async getAllEmployees(page: number, size: number): Promise<any> {
    try {
      return await Employee.find()
        .populate("user")
        .skip(page * size)
        .limit(size);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAllEmployeesAmount(): Promise<number> {
    try {
      return await Employee.find().count();
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
      throw new Error("Repair Company creating is failed");
    }
  }

  async getRepairCompanyByUserId(userId: string): Promise<any> {
    try {
      return await RepairCompany.findOne({ user: userId }).populate("user");
    } catch (error: any) {
      throw new Error("Repair company is not exists");
    }
  }

  async getRepairCompanyById(repairCompanyId: string): Promise<any> {
    try {
      return await RepairCompany.findOne({ _id: repairCompanyId }).populate(
        "user"
      );
    } catch (error: any) {
      throw new Error("Repair company is not exists");
    }
  }

  async getRepairCompanies(page: number, size: number): Promise<any> {
    try {
      return await RepairCompany.find()
        .populate("user")
        .skip(page * size)
        .limit(size);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getRepairCompaniesAmount(): Promise<number> {
    try {
      return await RepairCompany.find().count();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateRepairCompany(
    repairCompanyId: string,
    options: any
  ): Promise<void> {
    try {
      await User.updateOne(
        { _id: options.userId },
        { $set: { email: options.email } }
      );
      await RepairCompany.updateOne(
        { _id: repairCompanyId },
        {
          $set: {
            name: options.name,
            phone: options.phone,
            address: options.address,
          },
        }
      );
    } catch (error) {
      throw new Error("Repair Company updating is failed");
    }
  }

  /// Repair Company

  async getRepairProductById(repairProductId: string): Promise<any> {
    try {
      return await RepairProduct.findOne({ _id: repairProductId });
    } catch (error: any) {
      throw new Error("Repair products are not exists");
    }
  }

  async getRepairProducts(repairCompanyId: string): Promise<any> {
    try {
      return await RepairProduct.find({ repairCompany: repairCompanyId });
    } catch (error: any) {
      throw new Error("Repair products are not exists");
    }
  }

  async getRepairProductsAmount(repairCompanyId: string): Promise<number> {
    try {
      return await RepairProduct.find({
        repairCompany: repairCompanyId,
      }).count();
    } catch (error: any) {
      throw new Error("Repair products are not exists");
    }
  }

  async updateRepairProduct(
    repairProductId: string,
    options: any
  ): Promise<void> {
    try {
      await RepairProduct.updateOne(
        { _id: repairProductId },
        {
          $set: options,
        }
      );
    } catch (error) {
      throw new Error("Repair Product updating is failed");
    }
  }

  async deleteRepairProduct(repairProductId: string): Promise<void> {
    try {
      await RepairProduct.deleteOne({ _id: repairProductId });
    } catch (error) {
      throw new Error("Repair Product deleting is failed");
    }
  }

  async createRepairProduct(repairProduct: any): Promise<string> {
    try {
      const product = await new RepairProduct({
        _id: new mongoose.Types.ObjectId(),
        costs: repairProduct.costs,
        description: repairProduct.description,
        type: repairProduct.type,
        repairCompany: repairProduct.repairCompanyId,
      }).save();
      return product?._id.toString();
    } catch (error) {
      throw new Error("Repair Product creating is failed");
    }
  }

  /// Repair Event

  async getRepairEventById(id: string): Promise<any> {
    try {
      return await RepairEvent.findOne({ _id: id });
    } catch (error: any) {
      throw new Error("Repair events are not exists");
    }
  }

  async getRepairEvents(options: any): Promise<any> {
    try {
      return await RepairEvent.find(options);
    } catch (error: any) {
      throw new Error("Repair events are not exists");
    }
  }

  async getRepairEventsAmount(options: any): Promise<number> {
    try {
      return await RepairEvent.find(options).count();
    } catch (error: any) {
      throw new Error("Repair events are not exists");
    }
  }

  async updateRepairEvent(repairEventId: string, options: any): Promise<void> {
    try {
      await RepairEvent.updateOne(
        { _id: repairEventId },
        {
          $set: options,
        }
      );
    } catch (error) {
      throw new Error("Repair event updating is failed");
    }
  }

  async deleteRepairEvent(repairEventId: string): Promise<void> {
    try {
      await RepairEvent.deleteOne({ _id: repairEventId });
    } catch (error) {
      throw new Error("Repair event deleting is failed");
    }
  }

  async createRepairEvent(repairEvent: any): Promise<string> {
    try {
      const event = await new RepairEvent({
        _id: new mongoose.Types.ObjectId(),
        costs: repairEvent.costs,
        date: repairEvent.date,
        washMachine: repairEvent.washMachineId,
        repairProduct: repairEvent.repairProductId,
        done: repairEvent.done,
      }).save();
      return event?._id.toString();
    } catch (error) {
      throw new Error("Repair event creating is failed");
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
      throw new Error("WashMachine creating is failed");
    }
  }

  async updateWashMachine(
    washMachineId: string,
    washMachine: any
  ): Promise<void> {
    try {
      await WashMachine.updateOne(
        { _id: washMachineId },
        {
          $set: washMachine,
        }
      );
    } catch (error) {
      throw new Error("WashMachine updating is failed");
    }
  }

  async deleteWashMachine(washMachineId: string): Promise<void> {
    try {
      await WashMachine.deleteOne({ _id: washMachineId });
    } catch (error) {
      throw new Error("WashMachine deleting is failed");
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
      throw new Error("Additional Mode creating is failed");
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
      throw new Error("Additional Mode updating is failed");
    }
  }

  async deleteAdditionalMode(additionalModeId: string): Promise<void> {
    try {
      await AdditionalMode.deleteOne({ _id: additionalModeId });
    } catch (error) {
      throw new Error("Additional Mode deleting is failed");
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
      throw new Error("Mode creating is failed");
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
      throw new Error("Mode updating is failed");
    }
  }

  async deleteMode(modeId: string): Promise<void> {
    try {
      await Mode.deleteOne({ _id: modeId });
    } catch (error) {
      throw new Error("Mode deleting is failed");
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

  ///
  /// Events
  ///

  async createEvent(event: any): Promise<string> {
    try {
      const createdEvent = await new Event({
        _id: new mongoose.Types.ObjectId(),
        washMachine: event.washMachineId,
        temperature: event.temperature,
        spinning: event.spinning,
        mode: event.modeId,
        additionalMode: event.additionalModeId,
      }).save();
      return createdEvent?._id.toString();
    } catch (error) {
      throw new Error("Client creating is failed");
    }
  }

  async getEventById(eventId: string): Promise<any> {
    try {
      return await Event.findOne({ _id: eventId }).populate(
        "mode additionalMode"
      );
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async updateEventById(eventId: string, options: any): Promise<any> {
    try {
      return await Event.updateOne({ _id: eventId }, { $set: options });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getFilteredEvents(
    options: any,
    page: number,
    size: number
  ): Promise<any> {
    try {
      return await Event.find(options)
        .populate("mode additionalMode")
        .skip(page * size)
        .limit(size);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getFilteredEventsAmount(options: any): Promise<any> {
    try {
      return await Event.find(options).count();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await Event.deleteOne({ _id: eventId });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  ///
  /// Backups
  ///

  backupMongo(): ChildProcessWithoutNullStreams {
    const archivePath = `backup/${Date.now()}.gzip`;
    return spawn("mongodump", [
      `${process.env.URL}`,
      `--archive=./${archivePath}`,
      "--gzip",
    ]);
  }

  restoreMongo(backup: string): ChildProcessWithoutNullStreams {
    const archivePath = `backup/${backup}.gzip`;
    return spawn("mongorestore", [
      `${process.env.URL}`,
      `--archive=./${archivePath}`,
      "--gzip",
      "--drop",
    ]);
  }
}
