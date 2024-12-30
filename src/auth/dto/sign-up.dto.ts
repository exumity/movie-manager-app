import {
  IsAlphanumeric,
  IsISO8601,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(30)
  @MinLength(1)
  @IsString()
  readonly username: string;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(1)
  @IsString()
  readonly password: string;

  @ApiProperty({
    type: Date,
    example: '1990-01-20',
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    const v = new Date(value);
    v.setUTCHours(0, 0, 0, 0);
    return v.toISOString();
  })
  @IsISO8601()
  readonly birthday: string;
}
