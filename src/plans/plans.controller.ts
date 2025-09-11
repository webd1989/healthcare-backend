import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

@UseGuards(AuthGuard('jwt'))
@Post()
async create(
  @Body() dto: CreatePlanDto
) {
  dto.status = 1;
  const plan = await this.plansService.create(dto);
  return {
    success: true,
    message: 'Plan created successfully',
    data: plan,
  };
}

@UseGuards(AuthGuard('jwt'))
@Get('get-list')
async getAll() {
  const data = await this.plansService.findAll();
  return { records: data, success:true };
}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
  ) {
    return this.plansService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.plansService.findOne(id);
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
      destination: './uploads/plans',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdatePlanDto,
) {
  const data = await this.plansService.update(id, dto);
  return {
    success: true,
    message: 'Plan updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.plansService.update(id, { status } as UpdatePlanDto);
  return {
    success: true,
    message: 'Plan status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.plansService.remove(id);
  }


}
