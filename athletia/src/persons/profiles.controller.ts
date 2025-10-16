import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileUpdate } from './dto/persons.dto';
import { PersonsService } from './persons.service';
import { Person } from './person.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AccountsService } from 'src/accounts/accounts.service';
import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import { Role } from 'src/accounts/enum/role.enum';

@UseGuards(AuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(
    private personsService: PersonsService,
    private accountsService: AccountsService,
  ) {}

  @Get(':id')
  async findPerson(@Param('id') id: string): Promise<Person> {
    return await this.personsService.findById(id);
  }

  @Put(':id')
  async updateProfile(
    @Req() req: Request & { user: UserPayload },
    @Param('id') id: string,
    @Body() profileUpdate: ProfileUpdate,
  ): Promise<void> {
    const account = await this.accountsService.findById(req.user.sub);
    if (!account) {
      throw new ForbiddenException();
    }
    if (account.person.id !== id && account.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    await this.personsService.merge(id, profileUpdate);
  }
}
