import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './hospital.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
  ) {}

  async create(dto: CreateHospitalDto): Promise<any> {
    const hospital = this.hospitalRepo.create(dto);
    const saved = await this.hospitalRepo.save(hospital);
    
     return {
      success: true,
      message: 'Hospital created successfully',
      data: saved,
    };
  }

  async findAll(): Promise<Hospital[]> {
    return this.hospitalRepo.find();
  }

  async paginate(page: number, limit: number, searchTitle?: string) {
      const query = this.hospitalRepo.createQueryBuilder('hospital');

      if (searchTitle) {
        query.where(
          'hospital.name LIKE :search OR hospital.address LIKE :search',
          { search: `%${searchTitle}%` },
        );
      }

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        success: true,
        data,
        total,
        page,
        limit,
      };
  }

  async findOne(id: number): Promise<Hospital> {
    const hospital = await this.hospitalRepo.findOne({ where: { id } });
    if (!hospital) throw new NotFoundException(`Hospital ${id} not found`);
    
    return hospital;
  }

  async update(id: number, dto: UpdateHospitalDto): Promise<any> {
    const hospital = await this.findOne(id);
    Object.assign(hospital, dto);
    return this.hospitalRepo.save(hospital);
  }

  async remove(id: number): Promise<any> {
    const hospital = await this.findOne(id);
    await this.hospitalRepo.remove(hospital);
     return {
      success: true,
      message: 'Hospital deleted successfully',
    };
  }
}