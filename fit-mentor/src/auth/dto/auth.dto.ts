import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterAccountRequest {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginRequest {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
