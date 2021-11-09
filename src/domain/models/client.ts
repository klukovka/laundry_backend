import { User } from './user';

export class Client {
  clientId?: string | null;
  name: string;
  surname: string;
  phone: string;
  bonuses: number;
  user?: User | null;
  userId: string;

  constructor(
    name: string,
    surname: string,
    phone: string,
    userId: string,
    bonuses: number = 0,
    clientId: string | null = null,
    user: User | null = null
  ) {
    this.name = name;
    this.surname = surname;
    this.phone = phone;
    this.bonuses = bonuses;
    this.clientId = clientId;
    this.user = user;
    this.userId = userId;
  }
}
