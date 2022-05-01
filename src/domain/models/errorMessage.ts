export class ErrorMessage {
  statusCode: number;
  message: any;

  constructor(statusCode: number, message: any) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
