import mongoose, { Connection } from 'mongoose';
import { Laundry } from '../../../domain/models/laundry';
import LaundrySchema from './models/laundry';

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

  async createLaundry(laundry: Laundry): Promise<void> {
    try {
      await new LaundrySchema({
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

  async deleteLaundry(idLaundry: string): Promise<void> {
    const laundry = await LaundrySchema.findOne({ _id: idLaundry });
    if (laundry) {
      try {
        await LaundrySchema.deleteOne({ _id: idLaundry });
      } catch (error) {
        throw new Error('Laundry deleting is failed');
      }
    } else {
      throw new Error('Laundry has already been deleted!');
    }
  }

  async updateLaundry(idLaundry: string, options: any): Promise<void> {
    const laundry = await LaundrySchema.findOne({ _id: idLaundry });
    if (laundry) {
      try {
        await LaundrySchema.updateOne({ _id: idLaundry }, { $set: options });
      } catch (error) {
        throw new Error('Laundry updating is failed');
      }
    } else {
      throw new Error('Laundry is not exist');
    }
  }

  async getLaundry(idLaundry: string): Promise<any | null> {
    return LaundrySchema.findOne({ _id: idLaundry })
      .exec()
      .then((laundry: any) => {
        if (!laundry) {
          return null;
        }
        return laundry;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  async getAllLaundries(): Promise<any> {
    return LaundrySchema.find()
      .exec()
      .then((documents: any) => {
        return documents;
      })
      .catch((error: Error) => {
        throw error;
      });
  }
}
