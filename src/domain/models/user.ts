export class User {
  idUser?: string | null;
  email: string;
  password?: string;
  role: string | null;

  constructor(
    email: string,
    password: string,
    role: string | null = null,
    idUser: string | null = null
  ) {
    this.idUser = idUser;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
