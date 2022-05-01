// import { User } from '../models/user';
// import { hash, compare } from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { UserRepository } from '../repositories/userRepository';
// import { Mappers } from '../../features/utils/mappers';
// import nodemailer from 'nodemailer';
// import crypto from 'crypto';

// export class UserService {
//   private _repository: UserRepository;

//   constructor(repository: UserRepository) {
//     this._repository = repository;
//   }

//   async create(user: User): Promise<string> {
//     let hashedPassword;
//     try {
//       hashedPassword = await hash(user.password!, 10);
//     } catch (error: any) {
//       throw Error(`Hash error: ${error.toString()}`);
//     }

//     try {
//       const hashUser = new User(user.email, hashedPassword, user.role);
//       return await this._repository.create(hashUser);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async delete(userId: string): Promise<void> {
//     try {
//       return await this._repository.delete(userId);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async login(user: User): Promise<any | null> {
//     const { email, password } = user;
//     const userInRep = await this.getByEmail(email);

//     if (userInRep) {
//       let result;
//       try {
//         result = await compare(password!, userInRep.password!);
//       } catch (error) {
//         throw new Error('Auth failed');
//       }
//       if (result) {
//         const secret = process.env.SECRET || 'SECRET';
//         try {
//           const token = jwt.sign(
//             {
//               userId: userInRep.userId,
//               email: userInRep.email,
//               role: userInRep.role,
//             },
//             secret,
//             {
//               expiresIn: '1h',
//             }
//           );
//           return {
//             token: token,
//             userId: userInRep.userId,
//           };
//         } catch (error) {
//           throw error;
//         }
//       }
//       return null;
//     } else {
//       throw new Error('No such user');
//     }
//   }

//   async getById(userId: string): Promise<User | null> {
//     try {
//       return await this._repository.getById(userId);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async forgotPassword(email: string): Promise<any> {
//     try {
//       let user = await this.getByEmail(email);
//       if (user == null) return null;

//       const USER: string = process.env.USER as string;
//       const PASSWORD: string = process.env.PASSWORD as string;
//       const admin = { user: USER, pass: PASSWORD };

//       let transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 465,
//         auth: {
//           user: admin.user,
//           pass: admin.pass,
//         },
//       });

//       let tempPassword = crypto.randomBytes(20).toString('hex');
//       await this.update(user.userId!, [
//         { propName: 'password', value: tempPassword },
//       ]);

//       let result = await transporter.sendMail({
//         from: 'courseprojectbd@gmail.com',
//         to: email,
//         subject: 'Відновлення паролю (Restore password)',
//         html: `Не передавайте цей пароль нікому! Після відновлення доступу рекомендовано його змінити.\n
//         Do not give your password to anyone! An update to access is recommended for the first time.\n
//         <i>Пароль (Password): </i> <strong>${tempPassword}</strong>`,
//       });
//       return result;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async getByEmail(email: string): Promise<User | null> {
//     try {
//       return await this._repository.getByEmail(email);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async update(
//     userId: string,
//     options: [{ propName: string; value: any }]
//   ): Promise<void> {
//     try {
//       let mappedOptions = Mappers.mapRequestParamsToMap(options);
//       if (mappedOptions.get('password')) {
//         const hashedPassword = await hash(mappedOptions.get('password'), 10);
//         mappedOptions.set('password', hashedPassword);
//       }
//       return await this._repository.update(userId, mappedOptions);
//     } catch (error) {
//       throw error;
//     }
//   }
// }
