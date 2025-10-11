import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTickets } from './support-tickets.entity';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTickets)
    private supportTicketRepo: Repository<SupportTickets>,
  ) {}

  async create(dto: CreateSupportTicketDto): Promise<any> {
    const supportTicket = this.supportTicketRepo.create(dto);
    const saved = await this.supportTicketRepo.save(supportTicket);

    const randomPart = Math.floor(1000000 + Math.random() * 9000000); // e.g., 3244324

    // Step 2️⃣: Combine into final ticket number
    const ticketNo = `TKT-${randomPart}-${String(saved.id).padStart(6, '0')}`;

    // Step 3️⃣: Update the same row
    await this.supportTicketRepo.update(saved.id, { ticket_no: ticketNo });

     return {
      success: true,
      message: 'Support ticket created successfully',
      data: saved,
    };
  }
  

  async findAll(): Promise<SupportTickets[]> {
    return this.supportTicketRepo.find();
  }

  async paginate(page: number, limit: number, searchTitle?:string, userID?:number, userType?:string) {
      const query = this.supportTicketRepo.createQueryBuilder('supportTicket');

      if (searchTitle) {
        query.where(
          'SupportTicket.subject LIKE :search',
          { search: `%${searchTitle}%` },
        );
      }

      if (userID && userID > 0 && userType && userType == 'Doctor') {
        query.where('SupportTicket.user_id = :user_id', { user_id: userID });
      }

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        success: true,
        data,
        total,
        page,
        limit,
      };
  }

  async findOne(id: number): Promise<SupportTickets> {
    const supportTicket = await this.supportTicketRepo.findOne({ where: { id } });
    if (!supportTicket) throw new NotFoundException(`SupportTicket ${id} not found`);
    return supportTicket;
  }

  async update(id: number, dto: UpdateSupportTicketDto): Promise<any> {
    const supportTicket = await this.findOne(id);
    Object.assign(supportTicket, dto);
    return this.supportTicketRepo.save(supportTicket);
  }

  async remove(id: number): Promise<any> {
    const supportTicket = await this.findOne(id);
    await this.supportTicketRepo.remove(supportTicket);
     return {
      success: true,
      message: 'Support ticket deleted successfully',
    };
  }
}