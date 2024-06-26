import { PagedModel } from "../models/pagedModel";
import { RepairCompany } from "../models/repairCompany";
import { RepairProduct } from "../models/repairProduct";
import { RepairEvent } from "../models/repairEvent";
import { RepairCompanyRepository } from "../repositories/repairCompanyRepository";
import { EventRepository } from "../repositories/eventRepository";

export class RepairCompanyService {
  private _repairCompanyRepository: RepairCompanyRepository;
  private _eventRepository: EventRepository;

  constructor(
    repairCompanyRepository: RepairCompanyRepository,
    eventRepository: EventRepository
  ) {
    this._repairCompanyRepository = repairCompanyRepository;
    this._eventRepository = eventRepository;
  }

  async getRepairCompanies(options: any): Promise<PagedModel<RepairCompany>> {
    try {
      const size = Number(options.size ?? 15);
      const page = Number(options.page ?? 0);
      const content = await this._repairCompanyRepository.getRepairCompanies(
        page,
        size
      );
      const totalElements =
        await this._repairCompanyRepository.getRepairCompaniesAmount();

      return new PagedModel<RepairCompany>(
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

  async getAllRepairProducts(options: any): Promise<PagedModel<RepairProduct>> {
    try {
      const size = Number(options.size ?? 15);
      const page = Number(options.page ?? 0);
      const content = await this._repairCompanyRepository.getAllRepairProducts(
        page,
        size
      );
      const totalElements =
        await this._repairCompanyRepository.getAllRepairProductsAmount();

      return new PagedModel<RepairProduct>(
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


  async updateRepairCompany(repairCompany: any): Promise<void> {
    try {
      await this._repairCompanyRepository.updateRepairCompany(
        new RepairCompany(
          repairCompany.name,
          repairCompany.phone,
          repairCompany.userData.userId,
          repairCompany.address,
          repairCompany.userData.id
        )
      );
    } catch (error) {
      throw error;
    }
  }

  async getRepairCompanyById(
    repairCompanyId: string
  ): Promise<RepairCompany | null> {
    try {
      return await this._repairCompanyRepository.getRepairCompanyById(
        repairCompanyId
      );
    } catch (error) {
      throw error;
    }
  }

  async getRepairProducts(
    repairCompanyId: string
  ): Promise<PagedModel<RepairProduct>> {
    try {
      const content = await this._repairCompanyRepository.getRepairProducts(
        repairCompanyId
      );
      const totalElements =
        await this._repairCompanyRepository.getRepairProductsAmount(
          repairCompanyId
        );

      return new PagedModel<RepairProduct>(
        0,
        totalElements,
        1,
        totalElements,
        content
      );
    } catch (error) {
      throw error;
    }
  }

  async updateRepairProduct(
    repairProductId: string,
    options: any
  ): Promise<void> {
    try {
      await this._repairCompanyRepository.updateRepairProduct(
        repairProductId,
        options
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteRepairProduct(repairProductId: string): Promise<void> {
    try {
      await this._repairCompanyRepository.deleteRepairProduct(repairProductId);
    } catch (error) {
      throw error;
    }
  }

  async createRepairProduct(repairProduct: any): Promise<string> {
    try {
      return await this._repairCompanyRepository.createRepairProduct(
        new RepairProduct(
          repairProduct.costs,
          repairProduct.description,
          repairProduct.type,
          repairProduct.userData.id
        )
      );
    } catch (error) {
      throw error;
    }
  }

  async getRepairEvents(options: any): Promise<PagedModel<RepairEvent>> {
    try {
      const content = await this._repairCompanyRepository.getRepairEvents(
        options
      );
      const totalElements =
        await this._repairCompanyRepository.getRepairEventsAmount(options);

      return new PagedModel<RepairEvent>(
        0,
        totalElements,
        1,
        totalElements,
        content
      );
    } catch (error) {
      throw error;
    }
  }

  async updateRepairEvent(repairEventId: string, options: any): Promise<void> {
    try {
      await this._repairCompanyRepository.updateRepairEvent(
        repairEventId,
        options
      );
      const repairEvent =
        await this._repairCompanyRepository.getRepairEventById(repairEventId);
      await this._eventRepository.updateWashMachine(
        repairEvent!.washMachineId,
        {
          isWorking: true,
          currentTime: 0,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteRepairEvent(repairEventId: string): Promise<void> {
    try {
      await this._repairCompanyRepository.deleteRepairEvent(repairEventId);
    } catch (error) {
      throw error;
    }
  }

  async createRepairEvent(repairEvent: any): Promise<string> {
    try {
      const repairProduct =
        await this._repairCompanyRepository.getRepairProductById(
          repairEvent.repairProductId
        );
      await this._eventRepository.updateWashMachine(repairEvent.washMachineId, {
        isWorking: false,
      });
      return await this._repairCompanyRepository.createRepairEvent(
        new RepairEvent(
          repairProduct?.costs ?? 0,
          new Date(),
          repairEvent.washMachineId,
          repairEvent.repairProductId
        )
      );
    } catch (error) {
      throw error;
    }
  }
}
