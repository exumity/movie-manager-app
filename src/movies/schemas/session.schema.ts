import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { TimeSlotType } from '../constants/time-slots.constant';
import { HydratedDocument } from 'mongoose';

export type MovieSessionDocument = HydratedDocument<MovieSession>;

@Schema({ timestamps: true })
export class MovieSession {
  @Prop({ required: true, type: 'String' })
  timeSlot: TimeSlotType;

  @Prop({ required: true, type: 'Date' })
  date: Date;

  @Prop({ required: true, type: 'Number' })
  roomNumber: number;

  @Virtual({
    get: function (this: MovieSession) {
      return (
        this.date.getTime() +
        (parseInt(this.timeSlot.split('_')[0], 10) - 3) * 60 * 60 * 1000
      );
    },
  })
  startTime: number;

  @Virtual({
    get: function (this: MovieSession) {
      return (
        this.date.getTime() +
        (parseInt(this.timeSlot.split('_')[1], 10) - 3) * 60 * 60 * 1000
      );
    },
  })
  endTime: number;
}

export const MovieSessionSchema = SchemaFactory.createForClass(MovieSession);
