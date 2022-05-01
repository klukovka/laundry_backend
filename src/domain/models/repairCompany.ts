import { User } from './user';

export class RepairCompany {
  repairCompanyId?: string | null;
  name: string;
  phone: string;
  address: string;
  user?: User | null;
  userId: string;

  constructor(
    name: string,
    phone: string,
    userId: string,
    address: string,
    repairCompanyId: string | null = null,
    user: User | null = null
  ) {
    this.name = name;
    this.phone = phone;
    this.repairCompanyId = repairCompanyId;
    this.user = user;
    this.userId = userId;
    this.address = address;
  }
}
