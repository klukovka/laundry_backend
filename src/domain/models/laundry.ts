import { User } from './user';

export class Laundry {
  laundryId?: string | null;
  name: string;
  address: string;
  phone: string;
  maxAmount: number;
  user?: User | null;
  userId: string;

  constructor(
    name: string,
    address: string,
    phone: string,
    maxAmount: number,
    userId: string,
    laundryId: string | null = null,
    user: User | null = null
  ) {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.laundryId = laundryId;
    this.maxAmount = maxAmount;
    this.user = user;
    this.userId = userId;
  }
}
