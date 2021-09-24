import { User } from '../models/user';

export interface UserRepository {
  create(user: User): Promise<string>;
  update(userId: string, options: Map<string, any>): Promise<void>;
  delete(userId: string): Promise<void>;
  getByEmail(email: string): Promise<User | null>;
  getById(userId: string): Promise<User | null>;
}
