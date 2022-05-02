import { Laundry } from './laundry';
import { User } from './user';

export class Employee {
  employeeId?: string | null;
  name: string;
  phone: string;
  birthday: Date;
  laundry?: Laundry | null;
  laundryId: string;
  user?: User | null;
  userId: string;

  constructor(
    name: string,
    phone: string,
    birthday: Date,
    laundryId: string,
    userId: string,
    employeeId: string | null = null,
    laundry: Laundry | null = null,
    user: User | null = null
  ) {
    this.name = name;
    this.phone = phone;
    this.birthday = birthday;
    this.employeeId = employeeId;
    this.user = user;
    this.laundryId = laundryId;
    this.laundry = laundry;
    this.userId = userId;
  }
}
