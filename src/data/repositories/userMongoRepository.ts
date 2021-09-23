import { User } from '../../domain/models/user';
import { UserRepository } from '../../domain/repositories/userRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class UserMongoRepository implements UserRepository {
  async create(user: User): Promise<void> {
    try {
      return await DatabaseMongo.getDB.createUser(user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async update(idUser: string, options: Map<string, any>): Promise<void> {
    try {
      const objectOptions = {
        email: options.get('email'),
        password: options.get('password'),
        role: options.get('role'),
      };

      return await DatabaseMongo.getDB.updateUser(idUser, objectOptions);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async delete(idUser: string): Promise<void> {
    try {
      return await DatabaseMongo.getDB.deleteUser(idUser);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getByEmail(email: string): Promise<User | null> {
    try {
      const user = await DatabaseMongo.getDB.getUserByEmail(email);
      return this.getUser(user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async getById(idUser: string): Promise<User | null> {
    try {
      const user = await DatabaseMongo.getDB.getUserById(idUser);
      return this.getUser(user);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  getUser(user: any): User | null {
    if (!user) {
      return null;
    }
    return new User(user.email, user.password, user.role, user?._id.toString());
  }
}
