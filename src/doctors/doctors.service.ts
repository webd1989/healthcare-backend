import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';


@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(User)
    private doctorRepo: Repository<User>,
  ) {}

  async create(dto: CreateDoctorDto): Promise<any> {
    const doctor = this.doctorRepo.create(dto);
    const saved = await this.doctorRepo.save(doctor);
    
     return {
      success: true,
      message: 'Doctor created successfully',
      data: saved,
    };
  }

  async findAll(hospital_id: number): Promise<User[]> {
    return this.doctorRepo.find({
      where: {
        hospital_id: hospital_id,
        type: 'doctor',
      },
    });
  }

  async paginate(page: number, limit: number, searchTitle?: string) {
      const query = this.doctorRepo.createQueryBuilder('doctor');

      // Always filter by type = Doctor
      query.where('doctor.type = :type', { type: 'Doctor' });

      if (searchTitle) {
        query.where(
          'doctor.name LIKE :search OR doctor.email LIKE :search',
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
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) throw new NotFoundException(`Doctor ${id} not found`);
    
    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto): Promise<any> {
    const doctor = await this.findOne(id);
    Object.assign(doctor, dto);
    return this.doctorRepo.save(doctor);
  }

  async remove(id: number): Promise<any> {
    const doctor = await this.findOne(id);
    await this.doctorRepo.remove(doctor);
     return {
      success: true,
      message: 'Doctor deleted successfully',
    };
  }
}