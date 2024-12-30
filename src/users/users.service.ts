import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { WatchHistoryDto } from './dto/watch-history.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByUsername(createUserDto.username);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    return this.userModel.create({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, 10),
    });
  }

  async findAll() {
    return this.userModel.find({}, { password: 0 }).exec();
  }

  async findOne(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete({ _id: id }).exec();
  }

  addWatchHistory(id: string, watchHistoryDto: WatchHistoryDto) {
    return this.userModel
      .findOneAndUpdate(
        {
          _id: id,
          'watchHistory.movieId': { $ne: watchHistoryDto.movieId },
          'watchHistory.sessionId': { $ne: watchHistoryDto.sessionId },
        },
        { $push: { watchHistory: watchHistoryDto } },
      )
      .exec();
  }
}
