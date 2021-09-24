import { Laundry } from './laundry';
import { User } from './user';

export class Employee {
  employeeId?: string | null;
  name: string;
  surname: string;
  phone: string;
  birthday: Date;
  laundry?: Laundry | null;
  laundryId: string;
  user?: User | null;
  userId: string;

  constructor(
    name: string,
    surname: string,
    phone: string,
    birthday: Date,
    laundryId: string,
    userId: string,
    employeeId: string | null = null,
    laundry: Laundry | null = null,
    user: User | null = null
  ) {
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.birthday = birthday;
    this.laundry = laundry;
    this.employeeId = employeeId;
    this.user = user;
    this.laundryId = laundryId;
    this.userId = userId;
  }
}
