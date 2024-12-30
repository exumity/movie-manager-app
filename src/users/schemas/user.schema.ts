import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserType } from '../dto/create-user.dto';
import { WatchHistory, WatchHistorySchema } from './watch-history.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: 'String', unique: true })
  username: string;

  @Prop({ required: true, type: 'String' })
  password: string;

  @Prop({ required: true, type: 'Date' })
  birthday: Date;

  @Prop({ required: true, type: 'String', default: UserType.CUSTOMER })
  type: UserType;

  @Prop({ required: true, type: [WatchHistorySchema], default: [] })
  watchHistory: WatchHistory[];

  @Virtual({
    get: function (this: User) {
      const birthDate = new Date(this.birthday);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      return age;
    },
  })
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
