import { Laundry } from '../../domain/models/laundry';
import { User } from '../../domain/models/user';
import { LaundryRepository } from '../../domain/repositories/laundryRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class LaundryMongoRepository implements LaundryRepository {
  async getLaundryId(userId: string): Promise<Laundry | null> {
    try {
      const user = await DatabaseMongo.getDB.getLaundryByUserId(userId);
      return this._getLaundry(user);
    } catch (error) {
      throw error;
    }
  }

  private _getLaundry(laundry: any): Laundry | null {
    if (!laundry) {
      return null;
    }
    return new Laundry(
      laundry?.name,
      laundry?.address,
      laundry?.phone,
      laundry?.maxAmount,
      laundry?.user?._id.toString(),
      laundry?._id.toString(),
      new User(
        laundry?.user?.email,
        laundry?.user?.role,
        null,
        laundry?.user?._id.toString()
      )
    );
  }
}
