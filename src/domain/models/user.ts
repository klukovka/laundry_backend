export class User {
  idUser?: string | null;
  email: string;
  password: string;

  constructor(email: string, password: string, idUser: string | null = null) {
    this.idUser = idUser;
    this.email = email;
    this.password = password;
  }
}
