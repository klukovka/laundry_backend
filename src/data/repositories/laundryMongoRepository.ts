import { Laundry } from '../../domain/models/laundry';
import { LaundryRepository } from '../../domain/repositories/laundryRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class LaundryMongoRepository implements LaundryRepository {
  async create(laundry: Laundry): Promise<void> {
    try {
      await DatabaseMongo.getDB.createLaundry(laundry);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async update(idLaundry: string, options: Map<string, any>): Promise<void> {
    try {
      const objectOptions = {
        name: options.get('name'),
        city: options.get('city'),
        street: options.get('street'),
        house: options.get('house'),
        phone: options.get('phone'),
      };
      await DatabaseMongo.getDB.updateLaundry(idLaundry, objectOptions);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(idLaundry: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteLaundry(idLaundry);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async get(idLaundry: string): Promise<Laundry | null> {
    try {
      const laundry = await DatabaseMongo.getDB.getLaundry(idLaundry);
      if (laundry) {
        return new Laundry(
          laundry.name,
          laundry.city,
          laundry.street,
          laundry.house,
          laundry.phone,
          laundry?._id.toString()
        );
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async getAll(): Promise<Laundry[]> {
    try {
      const documents = await DatabaseMongo.getDB.getAllLaundries();

      let laundries = new Array<Laundry>();
      for (let i = 0; i < documents.length; i++) {
        laundries.push(
          new Laundry(
            documents[i].name,
            documents[i].city,
            documents[i].street,
            documents[i].house,
            documents[i].phone,
            documents[i]?._id.toString()
          )
        );
      }
      return laundries;
    } catch (error) {
      throw error;
    }
  }
}
