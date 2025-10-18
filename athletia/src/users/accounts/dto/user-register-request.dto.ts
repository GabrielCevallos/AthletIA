import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'src/users/profiles/enum/gender.enum';

export class UserRegisterRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  birthDate: Date;

  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
