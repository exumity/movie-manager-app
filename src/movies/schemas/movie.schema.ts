import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MovieSession, MovieSessionSchema } from './session.schema';

export type MovieDocument = HydratedDocument<Movie, MovieDocumentOverride>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, type: 'String' })
  name: string;

  @Prop({ type: 'Number', default: 0 })
  minAgeRestriction: number;

  @Prop({ required: true, type: [MovieSessionSchema] })
  sessions: MovieSession[];
}

export type MovieDocumentOverride = {
  sessions: Types.Subdocument<Types.ObjectId & MovieSession>;
};

export const MovieSchema = SchemaFactory.createForClass(Movie);
