import {
  IsAlphanumeric,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum UserType {
  'MANAGER' = 'MANAGER',
  'CUSTOMER' = 'CUSTOMER',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(30)
  @MinLength(1)
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(1)
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsDate()
  readonly birthday: string;

  @IsEnum(UserType)
  readonly type?: UserType;
}
