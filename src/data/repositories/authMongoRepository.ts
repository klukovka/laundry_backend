import { Client } from '../../domain/models/client';
import { Employee } from '../../domain/models/employee';
import { Laundry } from '../../domain/models/laundry';
import { RepairCompany } from '../../domain/models/repairCompany';
import { User } from '../../domain/models/user';
import { AuthRepository } from '../../domain/repositories/authRepository';
import { DatabaseMongo } from '../dataSource/mongoDB/databaseMongo';

export class AuthMongoRepository implements AuthRepository {
  async createUser(user: User): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createUser(user);
    } catch (error) {
      throw error;
    }
  }

  async createLaundry(laundry: Laundry): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createLaundry(laundry);
    } catch (error) {
      throw error;
    }
  }

  async createClient(client: Client): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createClient(client);
    } catch (error) {
      throw error;
    }
  }

  async createEmployee(employee: Employee): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createEmployee(employee);
    } catch (error) {
      throw error;
    }
  }

  async createRepairCompany(repairCompany: RepairCompany): Promise<string> {
    try {
      return await DatabaseMongo.getDB.createRepairCompany(repairCompany);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      return await DatabaseMongo.getDB.deleteUser(id);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      return await DatabaseMongo.getDB.updateUser(user.userId!, {
        email: user.email,
        password: user.password,
        role: user.role,
      });
    } catch (error) {
      throw error;
    }
  }

  async getByEmail(email: string, showPassword: boolean): Promise<User | null> {
    try {
      const user = await DatabaseMongo.getDB.getUserByEmail(email);
      return this.toUser(user, showPassword);
    } catch (error) {
      throw error;
    }
  }

  async getById(userId: string, showPassword: boolean): Promise<User | null> {
    try {
      const user = await DatabaseMongo.getDB.getUserById(userId);
      return this.toUser(user, showPassword);
    } catch (error) {
      throw error;
    }
  }

  toUser(user: any, showPassword: boolean): User | null {
    if (!user) {
      return null;
    }
    return new User(
      user.email,
      user.role,
      showPassword ? user.password : null,
      user?._id.toString()
    );
  }
}
