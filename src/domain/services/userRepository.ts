import { User } from '../models/user';

export interface UserRepository {
  create(user: User): void;
  update(userId: string, options: Map<string, any>): void;
  delete(userId: string): void;
  get(email: string): Promise<User | null>;
}
