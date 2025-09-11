import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timezones } from './timezones.entity';

@Injectable()
export class TimezonesService {
  constructor(
    @InjectRepository(Timezones)
    private hospitalRepo: Repository<Timezones>,
  ) {}


  async findAll(): Promise<Timezones[]> {
    return this.hospitalRepo.find();
  }
}