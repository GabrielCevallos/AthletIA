import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { Repository } from 'typeorm';
import { ProfileRequest, ProfileUpdate } from './dto/persons.dto';
import { Account } from 'src/accounts/account.entity';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private personsRepository: Repository<Person>,
  ) {}

  async create(
    account: Account,
    profileRequest: ProfileRequest,
  ): Promise<Person> {
    const personData = this.personsRepository.create({
      ...profileRequest,
      account: { id: account.id },
      updatedAt: new Date(),
    });
    return await this.personsRepository.save(personData);
  }

  // TEMPORAL next we will use paginations
  async findAll(): Promise<Person[]> {
    return await this.personsRepository.find();
  }

  async findById(id: string): Promise<Person> {
    const person = await this.personsRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundException('Person was not Found');
    }
    return person;
  }

  async merge(id: string, profileUpdate: ProfileUpdate): Promise<void> {
    const person = await this.personsRepository.findOneBy({ id });
    if (!person) {
      throw new NotFoundException('Person was not Found');
    }
    await this.personsRepository.save({
      ...person,
      ...profileUpdate,
      updatedAt: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    await this.personsRepository.delete({ id });
  }
}
