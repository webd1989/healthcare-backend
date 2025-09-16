import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patientform } from './patientforms.entity';
import { CreatePatientformDto } from './dto/create-patientform.dto';
import { UpdatePatientformDto } from './dto/update-patientform.dto';

@Injectable()
export class PatientformsService {
  constructor(
    @InjectRepository(Patientform)
    private patientformRepo: Repository<Patientform>,
  ) {}

  async create(dto: CreatePatientformDto): Promise<any> {
    const patientform = this.patientformRepo.create(dto);
    const saved = await this.patientformRepo.save(patientform);
    
     return {
      success: true,
      message: 'Patientform created successfully',
      data: saved,
    };
  }

  async findAll(): Promise<Patientform[]> {
    return this.patientformRepo.find();
  }

  async paginate(page: number, limit: number, searchTitle?: string) {
      const query = this.patientformRepo.createQueryBuilder('patientform');

      if (searchTitle) {
        query.where(
          'patientform.name LIKE :search',
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

  async findOne(id: number): Promise<Patientform> {
    const patientform = await this.patientformRepo.findOne({ where: { id } });
    if (!patientform) throw new NotFoundException(`Patientform ${id} not found`);
    
    return patientform;
  }

  async update(id: number, dto: UpdatePatientformDto): Promise<any> {
    const patientform = await this.findOne(id);
    Object.assign(patientform, dto);
    return this.patientformRepo.save(patientform);
  }

  async remove(id: number): Promise<any> {
    const patientform = await this.findOne(id);
    await this.patientformRepo.remove(patientform);
     return {
      success: true,
      message: 'Patientform deleted successfully',
    };
  }
}