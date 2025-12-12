import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcrypt';

@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @UseGuards(AuthGuard('jwt'))
@Post()
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/staffs', // folder
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async create(
  @Body() dto: CreateStaffDto,
  @UploadedFile() file?: Express.Multer.File, // 👈 optional
) {
  if (file) {
    dto.logo = file.filename; // store filename or `/uploads/staffs/${file.filename}`
  }
  dto.status = 1;
  dto.type = 'Staff';
  const hashed = await bcrypt.hash('12345', 10);
  dto.password = hashed;

  const staff = await this.staffsService.create(dto);

  return {
    success: true,
    message: 'Staff created successfully',
    data: staff,
  };
}

@UseGuards(AuthGuard('jwt'))
@Post('get-hospital-list')
async getAll(@Body('hospital_id') hospital_id: number) {
  const data = await this.staffsService.findAll(hospital_id);
  return { records: data, success:true };
}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
    @Body('status') searchStatus?: number,
    @Body('doctor_id') doctorId?: number,
  ) {
    return this.staffsService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
      searchStatus,
      Number(doctorId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.staffsService.findOne(id);
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
      destination: './uploads/staffs',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdateStaffDto,
  @UploadedFile() file?: Express.Multer.File,   // 👈 optional
) {
  if (file) {
    dto.logo = file.filename; // save just filename or `/uploads/staffs/${file.filename}`
  }

  const data = await this.staffsService.update(id, dto);

  return {
    success: true,
    message: 'Staff updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.staffsService.update(id, { status } as UpdateStaffDto);
  return {
    success: true,
    message: 'Staff status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.staffsService.remove(id);
  }
}


