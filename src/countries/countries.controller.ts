import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query  } from '@nestjs/common';

import { CountriesService } from './countries.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('countires')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @UseGuards(AuthGuard('jwt'))


@UseGuards(AuthGuard('jwt'))
@Get('list')
async getAll() {
  const data = await this.countriesService.findAll();
  return { records: data, success:true };
}

}
