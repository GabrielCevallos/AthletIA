import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAccountRequest {
  @IsEmail()
  @ApiProperty({ format: 'email', example: 'user@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'strongP@ssw0rd' })
  password: string;
}

export class LoginRequest {
  @IsEmail()
  @ApiProperty({ format: 'email', example: 'user@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'strongP@ssw0rd' })
  password: string;
}

export class TokenResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ required: false, format: 'uuid' })
  accountId?: string;
}

export class ChangePasswordRequest {
  @ApiProperty()
  currentPassword: string;

  @ApiProperty()
  newPassword: string;
}
