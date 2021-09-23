export class User {
  idUser?: string | null;
  email: string;
  password?: string | null;
  role: string;

  constructor(
    email: string,
    role: string,
    idUser: string | null = null,
    password: string | null = null
  ) {
    this.idUser = idUser;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
