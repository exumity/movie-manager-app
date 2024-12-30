import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
  @ApiProperty({
    type: 'string',
    example: 'New Movie Name',
  })
  @IsNotEmpty()
  @MaxLength(128)
  @MinLength(3)
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
    example: 13,
  })
  @IsNotEmpty()
  @MaxLength(18)
  @MinLength(0)
  minAgeRestriction: number;
}
