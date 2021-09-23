import { User } from '../models/user';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepository';
import { Mappers } from '../../features/utils/mappers';

export class UserService {
  private _repository: UserRepository;

  constructor(repository: UserRepository) {
    this._repository = repository;
  }

  async create(user: User): Promise<void> {
    let hashedPassword;
    try {
      hashedPassword = await hash(user.password, 10);
    } catch (error: any) {
      throw Error(`Hash error: ${error.toString()}`);
    }

    try {
      const hashUser = new User(user.email, user.role, hashedPassword);
      return await this._repository.create(hashUser);
    } catch (error) {
      throw error;
    }
  }

  async update(
    idUser: string,
    options: [{ propName: string; value: any }]
  ): Promise<void> {
    try {
      return await this._repository.update(
        idUser,
        Mappers.mapRequestParamsToMap(options)
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(idUser: string): Promise<void> {
    try {
      return await this._repository.delete(idUser);
    } catch (error) {
      throw error;
    }
  }

  async login(user: User): Promise<string | null> {
    const { email, password } = user;
    const userInRep = await this.getByEmail(email);

    if (userInRep) {
      const result = await compare(password, userInRep.password);
      if (result) {
        const secret = process.env.SECRET || 'SECRET';
        try {
          const token = jwt.sign(
            {
              idUser: userInRep.idUser,
              email: userInRep.email,
              role: userInRep.role,
            },
            secret,
            {
              expiresIn: '1h',
            }
          );
          return token;
        } catch (error) {
          throw error;
        }
      }
      return null;
    } else {
      throw new Error('No such user');
    }
  }

  async getById(idUser: string): Promise<User | null> {
    try {
      return await this._repository.getById(idUser);
    } catch (error) {
      throw error;
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      return await this._repository.getByEmail(email);
    } catch (error) {
      throw error;
    }
  }
}
