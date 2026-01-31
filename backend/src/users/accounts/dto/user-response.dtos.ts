import { AccountState } from '../enum/account-states.enum';
import { Role } from '../enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserItem {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;
  @ApiProperty({
    description: 'Account status - Valid values: ACTIVE, SUSPENDED, DEACTIVATED',
    enum: AccountState,
    example: AccountState.ACTIVE,
  })
  status: string;
  @ApiProperty({ description: 'Full name', example: 'Jane Doe' })
  name: string;
}

export class User {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;
  @ApiProperty({
    description: 'Account status - Valid values: ACTIVE, SUSPENDED, DEACTIVATED',
    enum: AccountState,
    example: AccountState.ACTIVE,
  })
  state: AccountState;
  @ApiProperty({ 
    description: 'Assigned role - Valid values: user, admin, moderator', 
    enum: Role, 
    example: Role.USER 
  })
  role: Role;
  @ApiProperty({ description: 'Indicates if profile exists', example: true })
  hasProfile: boolean;
  @ApiProperty({ description: 'Full name', example: 'Jane Doe', nullable: true })
  name?: string | null;
  @ApiProperty({
    description: 'Birth date',
    example: '1990-01-01',
    nullable: true,
  })
  birthDate?: Date | null;
}
