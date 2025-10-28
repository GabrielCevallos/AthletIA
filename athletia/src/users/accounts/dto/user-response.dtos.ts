import { Role } from '../enum/role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserItem {
  @ApiProperty()
  email: string;

  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  name: string;
}

export class User {
  @ApiProperty()
  email: string;

  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ enum: Object.values(Role) })
  role: Role;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ type: 'string', format: 'date', nullable: true })
  birthDate: Date | null;
}
