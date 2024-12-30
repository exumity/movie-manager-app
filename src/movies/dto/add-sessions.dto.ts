import { ArrayMaxSize, ArrayMinSize, ValidateNested } from 'class-validator';
import { MovieSessionDto } from './movie-session.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TimeSlotType } from '../constants/time-slots.constant';

export class AddSessionsDto {
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
  @ArrayMaxSize(20)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  sessions: MovieSessionDto[];
}
