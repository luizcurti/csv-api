export class AppError {
  public readonly message: string;
  public readonly code: number;
  public readonly type: string;
  public readonly data: any;

  constructor(message = '', code = 400, type = 'Bad Request', data = {}) {
    this.message = message;
    this.code = code;
    this.type = type;
    this.data = data;
  }

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, AppError);
  }
}
