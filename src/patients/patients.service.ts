import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';


@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(User)
    private patientRepo: Repository<User>,
  ) {}

  async create(dto: CreatePatientDto): Promise<any> {
    const patient = this.patientRepo.create(dto);
    const saved = await this.patientRepo.save(patient);
    
     return {
      success: true,
      message: 'Patient created successfully',
      data: saved,
    };
  }

  async findAll(hospital_id: number): Promise<User[]> {
    return this.patientRepo.find({
      where: {
        hospital_id: hospital_id,
        type: 'patient',
      },
    });
  }

  async paginate(page: number, limit: number, searchTitle?: string) {
      const query = this.patientRepo.createQueryBuilder('patient');

      // Always filter by type = Patient
      query.where('patient.type = :type', { type: 'Patient' });

      if (searchTitle) {
        query.where(
          'patient.name LIKE :search OR patient.email LIKE :search',
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

  async findOne(id: number): Promise<User> {
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException(`Patient ${id} not found`);
    
    return patient;
  }

  async update(id: number, dto: UpdatePatientDto): Promise<any> {
    const patient = await this.findOne(id);
    Object.assign(patient, dto);
    return this.patientRepo.save(patient);
  }

  async remove(id: number): Promise<any> {
    const patient = await this.findOne(id);
    await this.patientRepo.remove(patient);
     return {
      success: true,
      message: 'Patient deleted successfully',
    };
  }
}