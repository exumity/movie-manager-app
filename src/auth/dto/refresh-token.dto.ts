import { IsBase64, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    type: 'string',
  })
  @IsBase64()
  @IsString()
  refreshToken: string;
}
