import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @UseGuards(AuthGuard('jwt'))
@Post()
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/hospitals', // folder
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async create(
  @Body() dto: CreateHospitalDto,
  @UploadedFile() file?: Express.Multer.File, // 👈 optional
) {
  if (file) {
    dto.logo = file.filename; // store filename or `/uploads/hospitals/${file.filename}`
  }
  dto.status = 1;
  const hospital = await this.hospitalsService.create(dto);

  return {
    success: true,
    message: 'Hospital created successfully',
    data: hospital,
  };
}

@UseGuards(AuthGuard('jwt'))
@Get('get-list')
async getAll() {
  const data = await this.hospitalsService.findAll();
  return { records: data, success:true };
}

@UseGuards(AuthGuard('jwt'))
@Get('dashboard/total')
async getTotalOrganizations() {
  const data = await this.hospitalsService.getTotalActiveCount();
  return {
    success: true,
    data: data.total,
    monthlyChange: data.monthlyChange,
    changeText: data.changeText,
  };
}

@UseGuards(AuthGuard('jwt'))
@Get('dashboard/recent')
async getRecentOrganizations() {
  const data = await this.hospitalsService.getRecentOrganizations();
  return {
    success: true,
    data,
  };
}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
  ) {
    return this.hospitalsService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.hospitalsService.findOne(id);
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
      destination: './uploads/hospitals',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdateHospitalDto,
  @UploadedFile() file?: Express.Multer.File,   // 👈 optional
) {
  if (file) {
    dto.logo = file.filename; // save just filename or `/uploads/hospitals/${file.filename}`
  }

  const data = await this.hospitalsService.update(id, dto);

  return {
    success: true,
    message: 'Hospital updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.hospitalsService.update(id, { status } as UpdateHospitalDto);
  return {
    success: true,
    message: 'Hospital status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.hospitalsService.remove(id);
  }


}
