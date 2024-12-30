import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Movie } from '../../movies/schemas/movie.schema';
import { MovieSession } from '../../movies/schemas/session.schema';

export type MovieDocument = HydratedDocument<Ticket, MovieDocumentOverride>;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.ObjectId,
    ref: Movie.name,
  })
  movieId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.ObjectId,
    ref: MovieSession.name,
  })
  sessionId: Types.ObjectId;
}

export type MovieDocumentOverride = {
  sessions: Types.Subdocument<Types.ObjectId & MovieSession>;
};

export const TicketSchema = SchemaFactory.createForClass(Ticket);
