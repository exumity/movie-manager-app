import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    type: 'string',
  })
  @IsAlphanumeric()
  @MaxLength(30)
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    type: 'string',
  })
  @MaxLength(30)
  @MinLength(1)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
