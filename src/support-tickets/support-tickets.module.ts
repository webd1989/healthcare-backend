import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicketsService } from './support-tickets.service';
import { SupportTicketsController } from './support-tickets.controller';
import { SupportTickets } from './support-tickets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportTickets])],
  providers: [SupportTicketsService],
  controllers: [SupportTicketsController],
})
export class SupportTicketsModule {}