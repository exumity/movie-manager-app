import { TimeSlotType } from '../constants/time-slots.constant';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MovieSessionDto {
  @ApiProperty({
    enum: TimeSlotType,
    example: TimeSlotType['10_12'],
  })
  @IsEnum(TimeSlotType)
  timeSlot: TimeSlotType;

  @ApiProperty({
    type: Date,
    example: '2024-12-30T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    const v = new Date(value);
    v.setUTCHours(0, 0, 0, 0);
    return v.toISOString();
  })
  @IsISO8601()
  date: Date;

  @ApiProperty({
    type: 'number',
    example: 5,
  })
  @IsNotEmpty()
  @Max(500)
  @Min(1)
  @IsNumber()
  roomNumber: number;
}
