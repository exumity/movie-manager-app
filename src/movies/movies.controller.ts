import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { OnlyManager } from '../auth/decorators/manager.decorator';
import { ListMoviesDto } from './dto/list-movies.dto';
import { AddSessionsDto } from './dto/add-sessions.dto';
import { RemoveSessionsDto } from './dto/remove-sessions.dto';
import { WatchDto } from './dto/watch.dto';
import { CurrentUser } from '../decorators/get-current-user.decorator';
import { AccessTokenPayloadInterface } from '../auth/interfaces/access-token-payload.interface';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({
    summary: 'Only Manager',
  })
  @Post()
  @OnlyManager()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  listMovies(@Body() listMoviesDto: ListMoviesDto) {
    return this.moviesService.list(listMoviesDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Only Manager',
  })
  @Patch(':id')
  @OnlyManager()
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiOperation({
    summary: 'Only Manager',
  })
  @Delete(':id')
  @OnlyManager()
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }

  @ApiOperation({
    summary: 'Only Manager',
  })
  @Post(':id/add-sessions')
  @OnlyManager()
  addSessions(@Param('id') id: string, @Body() addSessionDto: AddSessionsDto) {
    return this.moviesService.addSessions(id, addSessionDto.sessions);
  }

  @ApiOperation({
    summary: 'Only Manager',
  })
  @Delete(':id/remove-sessions')
  @OnlyManager()
  removeSessions(
    @Param('id') id: string,
    @Body() removeSessionsDto: RemoveSessionsDto,
  ) {
    return this.moviesService.removeSessions(id, removeSessionsDto);
  }

  @Get(':id/sessions/:sessionId/watch')
  watch(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AccessTokenPayloadInterface,
    @Body() watchDto: WatchDto,
  ) {
    return this.moviesService.watchMovie(
      user.id,
      id,
      sessionId,
      watchDto.ticketId,
    );
  }
}
