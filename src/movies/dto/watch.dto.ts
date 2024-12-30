import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WatchDto {
  @ApiProperty({
    type: 'string',
    example: '677241758a3c653cf54de371',
  })
  @IsMongoId()
  ticketId: string;
}
