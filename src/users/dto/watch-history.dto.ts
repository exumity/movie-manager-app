import { IsMongoId, IsString } from 'class-validator';

export class WatchHistoryDto {
  @IsMongoId()
  movieId: string;

  @IsMongoId()
  sessionId: string;

  @IsString()
  movieName: string;
}
