import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Countries } from './countries.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Countries)
    private hospitalRepo: Repository<Countries>,
  ) {}

  async findAll(): Promise<Countries[]> {
    return this.hospitalRepo.find();
  }

}