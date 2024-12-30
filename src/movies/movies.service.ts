import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Movie } from './schemas/movie.schema';
import { ListMoviesDto, ListMovieSortingKeys } from './dto/list-movies.dto';
import { MovieSessionDto } from './dto/movie-session.dto';
import { Room } from './schemas/room.schema';
import { timeSlotToDate } from '../utility';
import * as _ from 'lodash';
import { RemoveSessionsDto } from './dto/remove-sessions.dto';
import { MovieSessionDocument } from './schemas/session.schema';
import { TicketsService } from '../tickets/tickets.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @InjectConnection() private readonly connection: Connection,
    private readonly ticketService: TicketsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const movie = await this.movieModel.create([createMovieDto], { session });
      if (!movie) {
        throw new ConflictException(
          'Movie could not saved! Please try again later',
        );
      }
      await this.transactUpdateRooms(createMovieDto.sessions, session);
      await session.commitTransaction();
      return movie;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  list(listMoviesDto: ListMoviesDto) {
    const pageSize = 50;

    const sortingData: Record<string, any> = {};
    if (listMoviesDto.sort) {
      for (const key of Object.keys(listMoviesDto.sort)) {
        sortingData[key] =
          listMoviesDto.sort[key] === ListMovieSortingKeys.asc ? 1 : -1;
      }
    }
    const matchData: Record<string, any> = {};
    if (listMoviesDto.filter) {
      for (const item of listMoviesDto.filter) {
        matchData[item.field] = { [`$${item.operator}`]: item.value };
      }
    }

    const aggregate = [];
    if (Object.keys(sortingData).length > 0) {
      aggregate.push({ $sort: sortingData });
    }
    if (Object.keys(matchData).length > 0) {
      aggregate.push({ $match: matchData });
    }

    return this.movieModel
      .aggregate([
        ...aggregate,
        {
          $facet: {
            metadata: [{ $count: 'totalCount' }],
            data: [
              { $skip: (listMoviesDto.page - 1) * pageSize },
              { $limit: pageSize },
            ],
          },
        },
      ])
      .exec();
  }

  findOne(id: string) {
    return this.movieModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.movieModel.findOneAndUpdate({ _id: id }, updateMovieDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.movieModel.findOneAndDelete({ _id: id }).exec();
  }

  async addSessions(id: string, movieSessionsDto: MovieSessionDto[]) {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    const newSessions: MovieSessionDto[] = [];
    for (const movieSessionDto of movieSessionsDto) {
      if (
        !movie.sessions.find(
          (s) =>
            s.roomNumber !== movieSessionDto.roomNumber &&
            s.date.toISOString() !== movieSessionDto.date.toISOString() &&
            s.timeSlot !== movieSessionDto.timeSlot,
        )
      ) {
        newSessions.push(movieSessionDto);
        movie.markModified('sessions');
      }
    }
    if (!newSessions.length) {
      throw new BadRequestException(
        'Movie sessions could not be updated! Please check your data!',
      );
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      await this.transactUpdateRooms(movieSessionsDto, session);
      await movie.updateOne(
        {
          $push: {
            sessions: { $each: newSessions },
          },
        },
        { session },
      );
      await session.commitTransaction();
      return movie;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async removeSessions(id: string, removeSessionsDto: RemoveSessionsDto) {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const relatedSessions = movie.sessions.filter((s: MovieSessionDocument) =>
      removeSessionsDto.idList.includes(s.id),
    );

    const session = await this.connection.startSession();
    session.startTransaction();

    const groupedSessionsByRoom: Record<string, MovieSessionDocument[]> =
      _.groupBy(relatedSessions, 'roomNumber') as any;

    try {
      const promisesDeleteRooms = [];
      for (const key of Object.keys(groupedSessionsByRoom)) {
        const deletedSlots = groupedSessionsByRoom[key].map((s) => s.startTime);
        promisesDeleteRooms.push(
          this.roomModel.findOneAndUpdate(
            { number: parseInt(key) },
            {
              $pullAll: {
                takenSlots: deletedSlots,
              },
              $inc: { __v: 1 },
            },
            { session },
          ),
        );
      }

      const deleteResults = await Promise.allSettled(promisesDeleteRooms);

      if (deleteResults.find((r) => r.status === 'rejected' || !r.value)) {
        throw new ConflictException('Please try again later!');
      }

      movie.sessions = _.pullAllBy(
        movie.sessions,
        removeSessionsDto.idList.map((d) => ({ id: d })),
        'id',
      );
      movie.markModified('sessions');

      await movie.save({ session });
      await session.commitTransaction();
      return movie;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }

  async transactUpdateRooms(
    sessions: MovieSessionDto[],
    clientSession: ClientSession,
  ) {
    const relatedRooms = await this.roomModel
      .find({
        number: {
          $in: sessions.map((session) => session.roomNumber),
        },
      })
      .exec();

    for (const relatedRoom of relatedRooms) {
      for (const session of sessions) {
        if (
          relatedRoom.takenSlots.find(
            (s) =>
              s.toISOString() ===
              timeSlotToDate(
                session.date,
                session.timeSlot,
              ).startTime.toISOString(),
          )
        ) {
          throw new ConflictException(
            'Time slots conflict! Please check your data!',
          );
        }
      }
    }

    const groupedSessionsByRoom = _.groupBy(sessions, 'roomNumber');

    const promisesCreateRooms = [];
    const promisesUpdateRooms = [];
    for (const key of Object.keys(groupedSessionsByRoom)) {
      const relatedRoom = relatedRooms.find(
        (rr) => rr.number === parseInt(key, 10),
      );
      const newTakenSlots = groupedSessionsByRoom[key].map(
        (s) => timeSlotToDate(s.date, s.timeSlot).startTime,
      );
      if (relatedRoom) {
        promisesUpdateRooms.push(
          this.roomModel.findOneAndUpdate(
            { number: parseInt(key), __v: relatedRoom.__v },
            {
              $push: {
                takenSlots: {
                  $each: newTakenSlots,
                },
              },
              $inc: { __v: 1 },
            },
            { clientSession },
          ),
        );
      } else {
        promisesCreateRooms.push(
          this.roomModel.create(
            [
              {
                number: parseInt(key),
                takenSlots: newTakenSlots,
              },
            ],
            { clientSession },
          ),
        );
      }
    }
    const createResults = await Promise.allSettled(promisesCreateRooms);
    const updateResults = await Promise.allSettled(promisesUpdateRooms);

    if (
      createResults.find((r) => r.status === 'rejected' || !r.value) ||
      updateResults.find((r) => r.status === 'rejected' || !r.value)
    ) {
      throw new ConflictException('Room conflict! Please check your data!');
    }
  }

  async watchMovie(
    userId: string,
    movieId: string,
    sessionId: string,
    ticketId: string,
  ) {
    const movie = await this.findOne(movieId);
    if (!movie) {
      throw new NotFoundException(`Movie with id ${movieId} not found!`);
    }

    const session = movie.sessions.find(
      (s: MovieSessionDocument) => s.id === sessionId,
    ) as MovieSessionDocument;
    if (!session) {
      throw new NotFoundException(
        `Movie session with id ${sessionId} not found!`,
      );
    }

    const ticket = await this.ticketService.findOne(ticketId, userId);
    if (!ticket) {
      throw new NotFoundException(`Ticket with id ${ticketId} not found!`);
    }

    const now = Date.now();
    if (now < session.startTime) {
      return {
        message: `There's still time for the movie to start, please wait for a while and try again!`,
      };
    } else if (now > session.endTime) {
      throw new BadRequestException('The movie session has been ended');
    } else {
      await this.usersService.addWatchHistory(userId, {
        movieName: movie.name,
        movieId: movie.id,
        sessionId: session.id,
      });
      return {
        message: 'Enjoy watching',
      };
    }
  }
}
