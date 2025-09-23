import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { SuperUsersService } from './supperusers.service';
import { CreateSupperUsersDto } from './dto/create-supperuser.dto';
import { UpdateSupperUsersDto } from './dto/update-supperuser.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcrypt';

@Controller('supperusers')
export class SuperUsersController {
  constructor(private readonly superuserService: SuperUsersService) {}

  @UseGuards(AuthGuard('jwt'))
@Post()
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/users', // folder
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async create(
  @Body() dto: CreateSupperUsersDto,
  @UploadedFile() file?: Express.Multer.File, // 👈 optional
) {
  if (file) {
    dto.logo = file.filename; // store filename or `/uploads/userslename}`
  }
  dto.status = 1;
  dto.type = 'User';
  const hashed = await bcrypt.hash('12345', 10);
  dto.password = hashed;

  const supperusers = await this.superuserService.create(dto);

  return {
    success: true,
    message: 'User created successfully',
    data: supperusers,
  };
}

@UseGuards(AuthGuard('jwt'))
@Post('get-hospital-list')
async getAll(@Body('hospital_id') hospital_id: number) {
  const data = await this.superuserService.findAll(hospital_id);
  return { records: data, success:true };
}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
  ) {
    return this.superuserService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.superuserService.findOne(id);
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
      destination: './uploads/users',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdateSupperUsersDto,
  @UploadedFile() file?: Express.Multer.File,   // 👈 optional
) {
  if (file) {
    dto.logo = file.filename; // save just filename or `/uploads/users/${file.filename}`
  }

  const data = await this.superuserService.update(id, dto);

  return {
    success: true,
    message: 'User updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.superuserService.update(id, { status } as UpdateSupperUsersDto);
  return {
    success: true,
    message: 'User status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.superuserService.remove(id);
  }
}


