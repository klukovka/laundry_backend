import { Laundry } from './laundry';
import { User } from './user';

export class Employee {
  idEmployee?: string | null;
  name: string;
  surname: string;
  phone: string;
  birthday: Date;
  laundry?: Laundry | null;
  idLaundry: string;
  user?: User | null;
  idUser: string;

  constructor(
    name: string,
    surname: string,
    phone: string,
    birthday: Date,
    idLaundry: string,
    idUser: string,
    idEmployee: string | null = null,
    laundry: Laundry | null = null,
    user: User | null = null
  ) {
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.birthday = birthday;
    this.laundry = laundry;
    this.idEmployee = idEmployee;
    this.user = user;
    this.idLaundry = idLaundry;
    this.idUser = idUser;
  }
}
