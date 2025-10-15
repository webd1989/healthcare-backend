import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { PatientformsService } from './patientforms.service';
import { CreatePatientformDto } from './dto/create-patientform.dto';
import { UpdatePatientformDto } from './dto/update-patientform.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('patientforms')
export class PatientformsController {
  constructor(private readonly patientformsService: PatientformsService) {}

  @UseGuards(AuthGuard('jwt'))
@Post()
async create(@Body() dto: CreatePatientformDto) {
  dto.status = 1;

  const patientform = await this.patientformsService.create(dto);

  return {
    success: true,
    message: 'Patientform created successfully',
    data: patientform,
  };
}

@UseGuards(AuthGuard('jwt'))
@Get('get-list')
async getAll() {
  const data = await this.patientformsService.findAll();
  return { records: data, success:true };
}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
    @Body('doctor_id') doctorId?: number,
  ) {
    return this.patientformsService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
      Number(doctorId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.patientformsService.findOne(id);
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
      destination: './uploads/patientforms',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdatePatientformDto,
  @UploadedFile() file?: Express.Multer.File,   // 👈 optional
) {
  const data = await this.patientformsService.update(id, dto);

  return {
    success: true,
    message: 'Patientform updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.patientformsService.update(id, { status } as UpdatePatientformDto);
  return {
    success: true,
    message: 'Patientform status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.patientformsService.remove(id);
  }


}
