import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Movie } from '../../movies/schemas/movie.schema';

export type WatchHistoryDocument = HydratedDocument<WatchHistory>;

@Schema({ timestamps: true })
export class WatchHistory {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Movie.name,
  })
  movieId: Types.ObjectId;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Movie.name,
  })
  sessionId: Types.ObjectId;

  @Prop({ required: true, type: 'String' })
  movieName: string;
}

export const WatchHistorySchema = SchemaFactory.createForClass(WatchHistory);
