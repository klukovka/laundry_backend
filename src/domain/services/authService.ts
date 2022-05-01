import { compare, hash } from 'bcrypt';
import { Client } from '../models/client';
import { Employee } from '../models/employee';
import { Laundry } from '../models/laundry';
import { RepairCompany } from '../models/repairCompany';
import { User } from '../models/user';
import { AuthRepository } from '../repositories/authRepository';
import { createTransport } from 'nodemailer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Roles from '../../controllers/utils/roles';
import { ClientRepository } from '../repositories/clientRepository';
import { EmployeeRepository } from '../repositories/employeeRepository';
import { RepairCompanyRepository } from '../repositories/repairCompanyRepository';
import { LaundryRepository } from '../repositories/laundryRepository';

export class AuthService {
  private _authRepository: AuthRepository;
  private _clientRepository: ClientRepository;
  private _employeeRepository: EmployeeRepository;
  private _repairCompanyRepository: RepairCompanyRepository;
  private _laundryRepository: LaundryRepository;

  constructor(
    authRepository: AuthRepository,
    clientRepository: ClientRepository,
    employeeRepository: EmployeeRepository,
    repairCompanyRepository: RepairCompanyRepository,
    laundryRepository: LaundryRepository
  ) {
    this._authRepository = authRepository;
    this._clientRepository = clientRepository;
    this._employeeRepository = employeeRepository;
    this._repairCompanyRepository = repairCompanyRepository;
    this._laundryRepository = laundryRepository;
  }

  async createUser(user: any): Promise<string> {
    try {
      const hashedUser = await this._hashUser(user);
      return await this._authRepository.createUser(hashedUser);
    } catch (error) {
      throw error;
    }
  }

  async createLaundry(laundry: any): Promise<string> {
    try {
      const userId = await this.createUser(
        new User(laundry.email, Roles.LAUNDRY, laundry.password)
      );
      return await this._authRepository.createLaundry(
        new Laundry(
          laundry.name,
          laundry.address,
          laundry.phone,
          laundry.maxAmount,
          userId
        )
      );
    } catch (error) {
      throw error;
    }
  }

  async createClient(client: any): Promise<string> {
    try {
      const userId = await this.createUser(
        new User(client.email, Roles.CLIENT, client.password)
      );
      return await this._authRepository.createClient(
        new Client(client.name, client.phone, userId)
      );
    } catch (error) {
      throw error;
    }
  }

  async createEmployee(employee: any): Promise<string> {
    try {
      const userId = await this.createUser(
        new User(employee.email, Roles.EMPLOYEE, employee.password)
      );
      return await this._authRepository.createEmployee(
        new Employee(
          employee.name,
          employee.phone,
          employee.birthday,
          employee.laundryId,
          userId
        )
      );
    } catch (error) {
      throw error;
    }
  }

  async createRepairCompany(repairCompany: any): Promise<string> {
    try {
      const userId = await this.createUser(
        new User(
          repairCompany.email,
          Roles.REPAIR_COMPANY,
          repairCompany.password
        )
      );

      return await this._authRepository.createRepairCompany(
        new RepairCompany(
          repairCompany.name,
          repairCompany.phone,
          userId,
          repairCompany.address
        )
      );
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.getByEmail(email, true);

    if (user) {
      let result;
      try {
        result = await compare(password, user?.password!);
      } catch (error) {
        throw new Error('Auth failed');
      }

      if (result) {
        const secret = process.env.SECRET || 'SECRET';
        const id = await this._getId(user?.userId!, user?.role!);

        try {
          const token = jwt.sign(
            {
              userId: user.userId,
              email: user.email,
              role: user.role,
              id: id,
            },
            secret,
            {
              expiresIn: '1h',
            }
          );

          return {
            token: token,
            userId: user.userId,
            email: user.email,
            role: user.role,
            id: id,
          };
        } catch (error) {
          throw error;
        }
      }

      return null;
    } else {
      throw new Error('No such user');
    }
  }

  async forgotPassword(email: string): Promise<any> {
    try {
      let user = await this.getByEmail(email);
      if (user == null) return null;

      const USER: string = process.env.USER as string;
      const PASSWORD: string = process.env.PASSWORD as string;
      const admin = { user: USER, pass: PASSWORD };

      let transporter = createTransport({
        host: 'smtp.ukr.net',
        port: 465,
        auth: {
          user: admin.user,
          pass: admin.pass,
        },
      });

      let tempPassword =
        crypto.randomBytes(10).toString('hex') +
        crypto.randomBytes(10).toString('hex').toUpperCase();
      const hashedPassword = await hash(tempPassword, 10);
      await this._authRepository.updateUser(
        new User(user.email, user.role, hashedPassword, user.userId)
      );

      let result = await transporter.sendMail({
        from: admin.user,
        to: email,
        subject: 'Відновлення паролю (Restore password)',
        html: `Не передавайте цей пароль нікому! Після відновлення доступу рекомендовано його змінити.\n
        Do not give your password to anyone! An update to access is recommended for the first time.\n
        <i>Пароль (Password): </i> <strong>${tempPassword}</strong>`,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this._authRepository.deleteUser(userId);
    } catch (error) {
      throw error;
    }
  }

  private async _getId(userId: string, role: string): Promise<string | null> {
    let result;
    switch (role) {
      case Roles.ADMIN:
        result = userId;
      case Roles.CLIENT:
        result = (await this._clientRepository.getClientId(userId))?.clientId;
      case Roles.LAUNDRY:
        result = (await this._laundryRepository.getLaundryId(userId))
          ?.laundryId;
      case Roles.EMPLOYEE:
        result = (await this._employeeRepository.getEmployeeId(userId))
          ?.employeeId;
      case Roles.REPAIR_COMPANY:
        result = (
          await this._repairCompanyRepository.getRepairCompanyId(userId)
        )?.repairCompanyId;
      default:
        result = null;
    }
    if (result == undefined) {
      result = null;
    }
    return result;
  }

  async getByEmail(
    email: string,
    showPassword: boolean = false
  ): Promise<User | null> {
    try {
      return await this._authRepository.getByEmail(email, showPassword);
    } catch (error) {
      throw error;
    }
  }

  async getById(
    userId: string,
    showPassword: boolean = false
  ): Promise<User | null> {
    try {
      return await this._authRepository.getById(userId, showPassword);
    } catch (error) {
      throw error;
    }
  }

  private async _hashUser(user: User): Promise<User> {
    let hashedPassword;
    try {
      hashedPassword = await hash(user.password!, 10);
    } catch (error: any) {
      throw Error(`Hash error: ${error.toString()}`);
    }

    return new User(user.email, user.role, hashedPassword);
  }
}
