export class HttpError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number = 400, details?: any) {
    super(message);
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
