export class ApiResponse<T> {
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

  static success<T>(data: T, message = 'Request successful'): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static error<T>(message: string, errors?: string[]): ApiResponse<T> {
    return new ApiResponse<T>(false, message, undefined, errors);
  }
}
