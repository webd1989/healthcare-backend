import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcrypt';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @UseGuards(AuthGuard('jwt'))
@Post()
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/doctors', // folder
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async create(
  @Body() dto: CreateDoctorDto,
  @UploadedFile() file?: Express.Multer.File, // 👈 optional
) {
  if (file) {
    dto.logo = file.filename; // store filename or `/uploads/doctors/${file.filename}`
  }
  dto.status = 1;
  dto.type = 'Doctor';
  const hashed = await bcrypt.hash('12345', 10);
  dto.password = hashed;

  const doctor = await this.doctorsService.create(dto);

  return {
    success: true,
    message: 'Doctor created successfully',
    data: doctor,
  };
}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
  ) {
    return this.doctorsService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.doctorsService.findOne(id);
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
      destination: './uploads/doctors',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdateDoctorDto,
  @UploadedFile() file?: Express.Multer.File,   // 👈 optional
) {
  if (file) {
    dto.logo = file.filename; // save just filename or `/uploads/doctors/${file.filename}`
  }

  const data = await this.doctorsService.update(id, dto);

  return {
    success: true,
    message: 'Doctor updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.doctorsService.update(id, { status } as UpdateDoctorDto);
  return {
    success: true,
    message: 'Doctor status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.doctorsService.remove(id);
  }
}
