import { RepairCompany } from '../../domain/models/repairCompany';
import { User } from '../../domain/models/user';
import { RepairCompanyRepository } from '../../domain/repositories/repairCompanyRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class RepairCompanyMongoRepository implements RepairCompanyRepository {
  async getRepairCompanyId(userId: string): Promise<RepairCompany | null> {
    try {
      const user = await DatabaseMongo.getDB.getRepairCompanyByUserId(userId);
      return this._getRepairCompany(user);
    } catch (error) {
      throw error;
    }
  }

  private _getRepairCompany(repairCompany: any): RepairCompany | null {
    if (!repairCompany) {
      return null;
    }
    return new RepairCompany(
      repairCompany?.name,
      repairCompany?.phone,
      repairCompany?.user?._id.toString(),
      repairCompany?.address,
      repairCompany?._id.toString(),
      new User(
        repairCompany?.user?.email,
        repairCompany?.user?.role,
        null,
        repairCompany?.user?._id.toString()
      )
    );
  }
}
