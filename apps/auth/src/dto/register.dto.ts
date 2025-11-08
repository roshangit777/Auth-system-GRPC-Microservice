import { Escape } from 'class-sanitizer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  //@Escape() removes the html tags
  @Escape()
  @IsNotEmpty({ message: 'Please provide email' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsString({ message: 'Name should be a string' })
  email: string;

  @IsNotEmpty({ message: 'Please provide Name' })
  @IsString({ message: 'Name should be a string' })
  @MinLength(3, { message: 'Name must be at least 3 charecters long' })
  @MaxLength(50, { message: 'Name can not be longer then 50 charecters' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'Please provide password' })
  @MinLength(6, { message: 'Password must be at least 6 charecters long' })
  password: string;
}
