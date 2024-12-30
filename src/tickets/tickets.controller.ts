import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CurrentUser } from '../decorators/get-current-user.decorator';
import { AccessTokenPayloadInterface } from '../auth/interfaces/access-token-payload.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: AccessTokenPayloadInterface,
  ) {
    return this.ticketsService.create(
      { id: user.id, age: user.claims.age },
      createTicketDto,
    );
  }

  @Get()
  listTickets(@CurrentUser() user: AccessTokenPayloadInterface) {
    return this.ticketsService.listTickets(user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AccessTokenPayloadInterface,
  ) {
    return this.ticketsService.findOne(id, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: AccessTokenPayloadInterface,
  ) {
    return this.ticketsService.remove(id, user.id);
  }
}
