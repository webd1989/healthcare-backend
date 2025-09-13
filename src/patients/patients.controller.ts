import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcrypt';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

@UseGuards(AuthGuard('jwt'))
@Post()
async create(
  @Body() dto: CreatePatientDto,
) {  
  dto.status = 1;
  dto.type = 'Patient';
  const hashed = await bcrypt.hash('12345', 10);
  dto.password = hashed;

  const patient = await this.patientsService.create(dto);

  return {
    success: true,
    message: 'Patient created successfully',
    data: patient,
  };
}

@UseGuards(AuthGuard('jwt'))
@Post('get-hospital-list')
async getAll(@Body('hospital_id') hospital_id: number) {
  const data = await this.patientsService.findAll(hospital_id);
  return { records: data, success:true };
}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
  ) {
    return this.patientsService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.patientsService.findOne(id);
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
      destination: './uploads/patients',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdatePatientDto,
  @UploadedFile() file?: Express.Multer.File,   // 👈 optional
) {
 
  const data = await this.patientsService.update(id, dto);

  return {
    success: true,
    message: 'Patient updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.patientsService.update(id, { status } as UpdatePatientDto);
  return {
    success: true,
    message: 'Patient status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.patientsService.remove(id);
  }
}


