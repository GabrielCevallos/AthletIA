export class ResponseBody<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];

  constructor(success: boolean, message: string, data?: T, errors?: string[]) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success<T>(data: T, message = 'Request successful'): ResponseBody<T> {
    return new ResponseBody<T>(true, message, data);
  }

  static error<T>(message: string, errors?: string[]): ResponseBody<T> {
    return new ResponseBody<T>(false, message, undefined, errors);
  }
}
