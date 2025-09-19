import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @UseGuards(AuthGuard('jwt'))
@Post()

async create(
  @Body() dto: CreateRoleDto,
  @UploadedFile() file?: Express.Multer.File, // 👈 optional
) {
  dto.status = 1;
  const role = await this.rolesService.create(dto);
  return {
    success: true,
    message: 'Role created successfully',
    data: role,
  };
}

@UseGuards(AuthGuard('jwt'))
@Get('get-list')
async getAll() {
  const data = await this.rolesService.findAll();
  return { records: data, success:true };
}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
  ) {
    return this.rolesService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.rolesService.findOne(id);
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
      destination: './uploads/roles',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdateRoleDto,
) {
  const data = await this.rolesService.update(id, dto);
  return {
    success: true,
    message: 'Role updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.rolesService.update(id, { status } as UpdateRoleDto);
  return {
    success: true,
    message: 'Role status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }


}
