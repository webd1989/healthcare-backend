import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicketsService } from './support-tickets.service';
import { SupportTicketsController } from './support-tickets.controller';
import { SupportTickets } from './support-tickets.entity';
import { SupportTicketComments } from './support-ticket-comments.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportTickets, SupportTicketComments, User])],
  providers: [SupportTicketsService],
  controllers: [SupportTicketsController],
})
export class SupportTicketsModule {}