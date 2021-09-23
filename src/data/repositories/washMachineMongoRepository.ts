import { WashMachine } from '../../domain/models/washMachine';
import { WashMachineRepository } from '../../domain/repositories/washMachineRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class WashMachineMongoRepository implements WashMachineRepository {
  async create(washMachine: WashMachine): Promise<void> {
    try {
      await DatabaseMongo.getDB.createWashMachine(washMachine);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async update(
    idWashMachine: string,
    options: Map<string, any>
  ): Promise<void> {
    try {
      const objectOptions = {
        model: options.get('model'),
        manufacturer: options.get('manufacturer'),
        capacity: options.get('capacity'),
        powerUsage: options.get('powerUsage'),
        spinningSpeed: options.get('spinningSpeed'),
        laundry: options.get('laundry'),
      };

      await DatabaseMongo.getDB.updateWashMachine(idWashMachine, objectOptions);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(idWashMachine: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteWashMachine(idWashMachine);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async get(idWashMachine: string): Promise<WashMachine> {
    try {
      const washMachine = await DatabaseMongo.getDB.getWashMachine(
        idWashMachine
      );
      if (washMachine) {
        return new WashMachine(
          washMachine.model,
          washMachine.manufacturer,
          washMachine.capacity,
          washMachine.powerUsage,
          washMachine.spinningSpeed,
          washMachine.laundry._id.toString(),
          washMachine?._id.toString()
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAll(): Promise<WashMachine[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllWashMachines();

      let washMachines = new Array<WashMachine>();
      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          washMachines.push(
            new WashMachine(
              documents[i].model,
              documents[i].manufacturer,
              documents[i].capacity,
              documents[i].powerUsage,
              documents[i].spinningSpeed,
              documents[i].laundry._id.toString(),
              documents[i]?._id.toString()
            )
          );
        }
      }
      return washMachines;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getWithLaundry(idWashMachine: string): Promise<WashMachine> {
    try {
      const washMachine = await DatabaseMongo.getDB.getWashMachine(
        idWashMachine
      );
      if (washMachine) {
        return new WashMachine(
          washMachine.model,
          washMachine.manufacturer,
          washMachine.capacity,
          washMachine.powerUsage,
          washMachine.spinningSpeed,
          washMachine.laundry?._id.toString(),
          washMachine?._id.toString(),
          washMachine.laundry
        );
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getAllWithLaundry(): Promise<WashMachine[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllWashMachines();

      let washMachines = new Array<WashMachine>();
      if (documents) {
        for (let i = 0; i < documents.length; i++) {
          washMachines.push(
            new WashMachine(
              documents[i].model,
              documents[i].manufacturer,
              documents[i].capacity,
              documents[i].powerUsage,
              documents[i].spinningSpeed,
              documents[i].laundry?._id.toString(),
              documents[i]?._id.toString(),
              documents[i].laundry
            )
          );
        }
      }
      return washMachines;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
