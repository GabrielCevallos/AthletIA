import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterAccountRequest {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Password (min 8 chars)',
    minLength: 8,
    example: 'Str0ngP@ssw0rd',
  })
  password: string;
}

export class LoginRequest {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'User password', example: 'Str0ngP@ssw0rd' })
  password: string;
}

export class TokenResponse {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;
  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string;
  @ApiPropertyOptional({
    description: 'Account ID when applicable',
    example: 'uuid',
    nullable: true,
  })
  accountId?: string;
}

export class ChangePasswordRequest {
  @ApiProperty({ description: 'Current password', example: 'OldP@ss123' })
  currentPassword: string;
  @ApiProperty({
    description: 'New password',
    example: 'NewP@ss1234',
    minLength: 8,
  })
  newPassword: string;
}
export class ForgotPasswordRequest {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    format: 'email',
  })
  email: string;
}

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Reset token from email',
    example: 'token123...',
  })
  token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'New password',
    example: 'NewP@ss1234',
    minLength: 8,
  })
  newPassword: string;
}