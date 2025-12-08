import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcrypt';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

@UseGuards(AuthGuard('jwt'))
@Post()
async create(
  @Body() dto: CreateTemplateDto,
) {  
  dto.status = 1;
  const template = await this.templatesService.create(dto);

  return {
    success: true,
    message: 'Template created successfully',
    data: template,
  };
}

@UseGuards(AuthGuard('jwt'))
@Post('get-hospital-list')
async getAll(@Body('hospital_id') hospital_id: number) {
  const data = await this.templatesService.findAll(hospital_id);
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
    return this.templatesService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
      Number(doctorId),
    );
  }

@UseGuards(AuthGuard('jwt'))
@Post('get-templates-list')
async getAllTemplates(
  @Body() body: { doctor_id: number; }
) {  
  const { doctor_id} = body;
  const data = await this.templatesService.getAllTemplates(doctor_id);
  return { records: data, success:true };
}

@UseGuards(AuthGuard('jwt'))
@Get(':id')
async findOne(@Param('id') id: number) {
  const data = await this.templatesService.findOne(id);
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
      destination: './uploads/templates',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdateTemplateDto,
  @UploadedFile() file?: Express.Multer.File,   // 👈 optional
) {
 
  const data = await this.templatesService.update(id, dto);

  return {
    success: true,
    message: 'Template updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.templatesService.update(id, { status } as UpdateTemplateDto);
  return {
    success: true,
    message: 'Template status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.templatesService.remove(id);
  }
}


