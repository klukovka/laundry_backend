import { RepairCompany } from '../../domain/models/repairCompany';
import { RepairEvent } from '../../domain/models/repairEvent';
import { RepairProduct } from '../../domain/models/repairProduct';
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

  async getRepairCompanies(
    page: number,
    size: number
  ): Promise<RepairCompany[]> {
    try {
      const companies = await DatabaseMongo.getDB.getRepairCompanies(
        page,
        size
      );
      const parsedCompanies = new Array<RepairCompany>();
      if (companies) {
        for (let i = 0; i < companies.length; i++) {
          parsedCompanies.push(this._getRepairCompany(companies[i])!);
        }
      }
      return parsedCompanies;
    } catch (error) {
      throw error;
    }
  }

  async getRepairCompaniesAmount(): Promise<number> {
    try {
      return await DatabaseMongo.getDB.getRepairCompaniesAmount();
    } catch (error) {
      throw error;
    }
  }

  async updateRepairCompany(repairCompany: RepairCompany): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateRepairCompany(
        repairCompany.repairCompanyId!,
        {
          userId: repairCompany.userId,
          email: repairCompany.user?.userId,
          name: repairCompany.name,
          phone: repairCompany.phone,
          address: repairCompany.address,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async getRepairCompanyById(
    repairCompanyId: string
  ): Promise<RepairCompany | null> {
    try {
      const company = await DatabaseMongo.getDB.getRepairCompanyById(
        repairCompanyId
      );
      return this._getRepairCompany(company);
    } catch (error) {
      throw error;
    }
  }

  async getRepairProducts(repairCompanyId: string): Promise<RepairProduct[]> {
    try {
      const products = await DatabaseMongo.getDB.getRepairProducts(
        repairCompanyId
      );
      const parsedProducts = new Array<RepairProduct>();
      if (products) {
        for (let i = 0; i < products.length; i++) {
          parsedProducts.push(this._getRepairProduct(products[i])!);
        }
      }
      return parsedProducts;
    } catch (error) {
      throw error;
    }
  }

  async getRepairProductsAmount(repairCompanyId: string): Promise<number> {
    try {
      return await DatabaseMongo.getDB.getRepairProductsAmount(repairCompanyId);
    } catch (error) {
      throw error;
    }
  }

  async updateRepairProduct(
    repairProductId: string,
    options: any
  ): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateRepairProduct(repairProductId, options);
    } catch (error) {
      throw error;
    }
  }

  async deleteRepairProduct(repairProductId: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteRepairProduct(repairProductId);
    } catch (error) {
      throw error;
    }
  }

  async createRepairProduct(repairProduct: RepairProduct): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createRepairProduct(repairProduct);
    } catch (error) {
      throw error;
    }
  }

  async getRepairEvents(options: any): Promise<RepairEvent[]> {
    try {
      const events = await DatabaseMongo.getDB.getRepairEvents(options);
      const parsedEvents = new Array<RepairEvent>();
      if (events) {
        for (let i = 0; i < events.length; i++) {
          parsedEvents.push(this._getRepairEvent(events[i])!);
        }
      }
      return parsedEvents;
    } catch (error) {
      throw error;
    }
  }

  async getRepaiEventsAmount(options: any): Promise<number> {
    try {
      return await DatabaseMongo.getDB.getRepaiEventsAmount(options);
    } catch (error) {
      throw error;
    }
  }

  async updateRepairEvent(repairEventId: string, options: any): Promise<void> {
    try {
      await DatabaseMongo.getDB.updateRepairEvent(repairEventId, options);
    } catch (error) {
      throw error;
    }
  }

  async deleteRepairEvent(repairEventId: string): Promise<void> {
    try {
      await DatabaseMongo.getDB.deleteRepairEvent(repairEventId);
    } catch (error) {
      throw error;
    }
  }

  async createRepairEvent(repairEvent: RepairEvent): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createRepairEvent(repairEvent);
    } catch (error) {
      throw error;
    }
  }

  private _getRepairEvent(repairEvent: any): RepairEvent | null {
    if (!repairEvent) return null;

    return new RepairEvent(
      repairEvent.costs,
      repairEvent.date,
      repairEvent.washMachine?._id.toString(),
      repairEvent.repairProduct?._id.toString(),
      repairEvent.done
    );
  }

  private _getRepairProduct(repairProduct: any): RepairProduct | null {
    if (!repairProduct) return null;

    return new RepairProduct(
      repairProduct.costs,
      repairProduct.description,
      repairProduct.type,
      repairProduct.repairCompany?._id.toString(),
      repairProduct?._id.toString()
    );
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
