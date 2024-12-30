import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './schemas/ticket.schema';
import { MovieSessionDocument } from '../movies/schemas/session.schema';
import { timeSlotToDate } from '../utility';
import { Movie } from 'src/movies/schemas/movie.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  async create(
    user: { id: string; age: number },
    createTicketDto: CreateTicketDto,
  ) {
    const movie = await this.movieModel.findById(createTicketDto.movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const session = movie.sessions.find(
      (s: MovieSessionDocument) => s.id === createTicketDto.sessionId,
    );
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (user.age < movie.minAgeRestriction) {
      throw new BadRequestException('This movie is not suitable for your age.');
    }

    const now = Date.now();
    if (
      now > timeSlotToDate(session.date, session.timeSlot).startTime.getTime()
    ) {
      throw new BadRequestException('We are sorry, the movie session started!');
    } else if (
      now > timeSlotToDate(session.date, session.timeSlot).endTime.getTime()
    ) {
      throw new BadRequestException('We are sorry, the movie session ended!');
    }
    return this.ticketModel.create({ ...createTicketDto, userId: user.id });
  }

  listTickets(userId: string) {
    return this.ticketModel.find({ userId });
  }

  findOne(id: string, userId: string) {
    return this.ticketModel.findOne({ _id: id, userId });
  }

  remove(id: string, userId: string) {
    return this.ticketModel.findOneAndDelete({ _id: id, userId });
  }
}
