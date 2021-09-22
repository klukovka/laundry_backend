import { User } from './user';

export class Client {
  idClient?: string | null;
  name: string;
  surname: string;
  phone: string;
  bonuses: Number;
  user?: User | null;
  idUser: string;

  constructor(
    name: string,
    surname: string,
    phone: string,
    idUser: string,
    bonuses: Number = 0,
    idClient: string | null = null,
    user: User | null = null
  ) {
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.bonuses = bonuses;
    this.idClient = idClient;
    this.user = user;
    this.idUser = idUser;
  }
}
