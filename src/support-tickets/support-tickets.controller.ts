
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query, NotFoundException  } from '@nestjs/common';

import { SupportTicketsService } from './support-tickets.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { CreateSupportTicketCommentsDto } from './dto/create-support-ticket-comments.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly supporTicketsService: SupportTicketsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add-comments')
  async createComment(
    @Body() dto: CreateSupportTicketCommentsDto,
  ) {
    
    const user = await this.supporTicketsService.getUserById(dto.user_id);

     if (!user) {
        throw new NotFoundException('User not found');
      }

    dto.user_name = user.name;
    const supporTickets = await this.supporTicketsService.createComment(dto);
    return {
      success: true,
      message: 'Support ticket comment added successfully',
      data: supporTickets,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/support-tickets', // folder
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )

  async create(
    @Body() dto: CreateSupportTicketDto,
    @UploadedFile() file?: Express.Multer.File, // 👈 optional
  ) {
    if (file) {
      dto.attachment = file.filename; // store filename or `/uploads/suppor-tickets/${file.filename}`
    }
    dto.status = 1;
    const user = await this.supporTicketsService.getUserById(dto.user_id);

     if (!user) {
        throw new NotFoundException('User not found');
      }

    dto.user_name = user.name;
    const supporTickets = await this.supporTicketsService.create(dto);

    return {
      success: true,
      message: 'Support ticket created successfully',
      data: supporTickets,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get-list')
  async getAll() {
    const data = await this.supporTicketsService.findAll();
    return { records: data, success:true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('comments-list/:id')
  async getAllComments(
    @Param('id') id: number
  ) {
    const data = await this.supporTicketsService.getAllComments(id);
    return { records: data, success:true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
   async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
    @Body('user_id') userID: number = 1,
    @Body('user_type') userType?: string,
  ) {
    return this.supporTicketsService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
      Number(userID),
      userType,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.supporTicketsService.findOne(id);
    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/support-tickets',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateSupportTicketDto,
    @UploadedFile() file?: Express.Multer.File,   // 👈 optional
  ) {
    if (file) {
      dto.attachment = file.filename; // save just filename or `/uploads/support-tickets/${file.filename}`
    }

    const data = await this.supporTicketsService.update(id, dto);

    return {
      success: true,
      message: 'Support ticket updated successfully',
      data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update-status/:id')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: number,   // expect only status field
  ) {
    const data = await this.supporTicketsService.update(id, { status } as UpdateSupportTicketDto);
    return {
      success: true,
      message: 'Support ticket status updated successfully',
      data,
    };
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.supporTicketsService.remove(id);
  }

}

