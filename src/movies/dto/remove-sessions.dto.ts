import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveSessionsDto {
  @ApiProperty({
    type: () => [String],
    example: '6772411619585fa1d07dca63',
  })
  @ArrayMaxSize(20)
  @ArrayMinSize(1)
  @IsArray()
  @IsString({ each: true })
  idList: string[];
}
