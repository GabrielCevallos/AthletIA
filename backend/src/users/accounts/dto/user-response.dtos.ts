import { Role } from '../enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserItem {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;
  @ApiProperty({ description: 'User ID', example: 'uuid-v4' })
  id: string;
  @ApiProperty({ description: 'Account status', example: 'ACTIVE' })
  status: string;
  @ApiProperty({ description: 'Full name', example: 'Jane Doe' })
  name: string;
}

export class User {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;
  @ApiProperty({ description: 'User ID', example: 'uuid-v4' })
  id: string;
  @ApiProperty({ description: 'Account status', example: 'ACTIVE' })
  status: string;
  @ApiProperty({ description: 'Assigned role', enum: Role })
  role: Role;
  @ApiProperty({ description: 'Full name', example: 'Jane Doe' })
  name: string;
  @ApiProperty({ description: 'Birth date', type: Date, nullable: true })
  birthDate: Date | null;
}
