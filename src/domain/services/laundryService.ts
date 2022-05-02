import { LaundryRepository } from '../repositories/laundryRepository';
import { PagedModel } from '../models/pagedModel';
import { Laundry } from '../models/laundry';
import { User } from '../models/user';
import Roles from '../../controllers/utils/roles';

export class LaundryService {
  private _laundryRepository: LaundryRepository;

  constructor(laundryRepository: LaundryRepository) {
    this._laundryRepository = laundryRepository;
  }

  async getLaundries(
    page: number = 0,
    size: number = 15
  ): Promise<PagedModel<Laundry>> {
    try {
      const totalElements = await this._laundryRepository.getLaundriesAmount();
      const content = await this._laundryRepository.getLaundries(page, size);
      return new PagedModel<Laundry>(
        page,
        size,
        Math.ceil(totalElements / size),
        totalElements,
        content
      );
    } catch (error) {
      throw error;
    }
  }

  async updateLaundry(laundry: any): Promise<void> {
    try {
      await this._laundryRepository.updateLaundry(
        new Laundry(
          laundry.name,
          laundry.address,
          laundry.phone,
          laundry.maxAmount,
          laundry.userData.userId,
          null,
          new User(laundry.email, Roles.LAUNDRY)
        )
      );
    } catch (error) {
      throw error;
    }
  }

  async getLaundryByUserId(userId: string): Promise<Laundry | null> {
    try {
      return await this._laundryRepository.getLaundryByUserId(userId);
    } catch (error) {
      throw error;
    }
  }
}
