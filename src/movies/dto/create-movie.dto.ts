import { MovieSessionDto } from './movie-session.dto';
import {
  ArrayUnique,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DoNotIncludeStartedSlotsValidator } from '../validators/do-not-include-started-slots.validator';
import { ApiProperty } from '@nestjs/swagger';
import { TimeSlotType } from '../constants/time-slots.constant';

export class CreateMovieDto {
  @ApiProperty({
    type: 'string',
    example: 'Example Movie Name',
  })
  @IsNotEmpty()
  @MaxLength(128)
  @MinLength(3)
  @IsString()
  name: string;

  @ApiProperty({
    type: 'number',
    example: 7,
  })
  @Max(20)
  @Min(0)
  @IsInt()
  minAgeRestriction: number = 0;

  @ApiProperty({
    type: [MovieSessionDto],
    example: [
      {
        timeSlot: TimeSlotType['10_12'],
        date: '2024-12-30T00:00:00.000Z',
        roomNumber: 5,
      },
    ],
  })
  @Validate(DoNotIncludeStartedSlotsValidator, [1800])
  @ArrayUnique(
    (id: MovieSessionDto) => `${id.roomNumber}${id.date}${id.timeSlot}`,
  )
  @ValidateNested({ each: true })
  @Type(() => MovieSessionDto)
  sessions: MovieSessionDto[];
}
