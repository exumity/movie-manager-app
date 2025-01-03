import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, type: 'Number', unique: true })
  number: number;

  @Prop({ type: [Date], default: [] })
  takenSlots: Date[] = [];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
