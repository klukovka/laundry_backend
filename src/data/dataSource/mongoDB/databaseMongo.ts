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
    new LaundrySchema({
      _id: new mongoose.Types.ObjectId(),
      name: laundry.name,
      city: laundry.city,
      street: laundry.street,
      house: laundry.house,
      phone: laundry.phone,
    })
      .save()
      .then()
      .catch((error: Error) => {
        throw error;
      });
  }

  async deleteLaundry(idLaundry: string): Promise<void> {
    const laundry = await LaundrySchema.findOne({ _id: idLaundry });
    if (laundry) {
      LaundrySchema.deleteOne({ _id: idLaundry })
        .then()
        .catch((error: Error) => {
          throw error;
        });
    } else {
      throw new Error('Laundry has already been deleted!');
    }
  }

  async updateLaundry(
    idLaundry: string,
    options: Map<string, any>
  ): Promise<void> {
    const laundry = await LaundrySchema.findOne({ _id: idLaundry });
    if (laundry) {
      LaundrySchema.updateOne({ _id: idLaundry }, { $set: options })
        .then()
        .catch((error: Error) => {
          throw error;
        });
    } else {
      throw new Error('Laundry is not exist');
    }
  }

  async getLaundry(idLaundry: string): Promise<Laundry | null> {
    return LaundrySchema.findOne({ _id: idLaundry })
      .exec()
      .then((laundry: any) => {
        if (!laundry) {
          return null;
        }
        return new Laundry(
          laundry.name,
          laundry.city,
          laundry.street,
          laundry.house,
          laundry.phone,
          laundry?._id.toString()
        );
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  async getAllLaundries(): Promise<Array<Laundry>> {
    return LaundrySchema.find()
      .exec()
      .then((documents: any) => {
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
      })
      .catch((error: Error) => {
        throw error;
      });
  }
}
