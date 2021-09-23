import { User } from '../models/user';

export interface UserRepository {
  create(user: User): Promise<void>;
  update(idUser: string, options: Map<string, any>): Promise<void>;
  delete(idUser: string): Promise<void>;
  getByEmail(email: string): Promise<User | null>;
  getById(idUser: string): Promise<User | null>;
}
