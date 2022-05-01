export class User {
  userId?: string | null;
  email: string;
  password?: string;
  role: string;

  constructor(
    email: string,
    role: string,
    password: string | null = null,
    userId: string | null = null
  ) {
    this.userId = userId;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
