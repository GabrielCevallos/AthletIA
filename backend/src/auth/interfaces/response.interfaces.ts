import { UserPayload } from './user-payload.interface';

export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserPayload;
  access_token: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: UserPayload;
}
