import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Templates } from './templates.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { log } from 'console';
import * as qs from 'qs';
import { User } from '../auth/user.entity';
import { Hospital } from '../hospitals/hospital.entity';


@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Templates)
    private templateRepo: Repository<Templates>,
    
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
    
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private readonly configService: ConfigService
  ) {}

  async create(dto: CreateTemplateDto): Promise<any> {
      
    const template = this.templateRepo.create(dto);
    const saved = await this.templateRepo.save(template);

     return {
      success: true,
      message: 'Template created successfully',
      data: saved,
    };
  }
  async findAll(hospital_id: number): Promise<Templates[]> {
    return this.templateRepo.find({
      where: {
        hospital_id: hospital_id,
      },
    });
  }

 async getAllTemplates(doctor_id: number): Promise<Templates[]> {
    return this.templateRepo.find({
      where: {
        doctor_id: doctor_id
      },
    });
  }

  async paginate(
    page: number,
    limit: number,
    searchTitle?: string,
    doctorId?: number,
  ) {
    const query = this.templateRepo.createQueryBuilder('template');

    // Always filter by type = 'Template'
    //query.where('template.type = :type', { type: 'Template' });

    // If doctorId > 0, add filter
    if (doctorId && doctorId > 0) {
      query.andWhere('template.doctor_id = :doctorId', { doctorId });
    }

    // If searchTitle provided, search by name or email
    if (searchTitle && searchTitle.trim() !== '') {
      query.andWhere(
        '(template.first_name LIKE :search OR template.last_name LIKE :search OR  template.mobile LIKE :search)',
        { search: `%${searchTitle}%` },
      );
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

      // Fetch hospital names for each doctor
      const result = await Promise.all(
        data.map(async (staff) => {
          let hospitalName = 'N/A';
          let doctorName = 'N/A';
          if (staff.hospital_id && staff.hospital_id > 0) {
              const hospital = await this.hospitalRepo.findOneBy({
                id: staff.hospital_id,
              });
              hospitalName = hospital ? hospital.name : 'N/A';
            }

            if (staff.doctor_id && staff.doctor_id > 0) {
              const doctor = await this.userRepo.findOneBy({
                id: staff.doctor_id,
              });
              doctorName = doctor ? doctor.name : 'N/A';
            }

          return {
            ...staff,
            hospital_name: hospitalName,
            doctor_name: doctorName, // add hospital name
          };
        }),
      );

    return {
      success: true,
      data:result,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Templates> {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException(`Template ${id} not found`);
    return template;
  }

  async update(id: number, dto: UpdateTemplateDto): Promise<any> {
    const template = await this.findOne(id);
    Object.assign(template, dto);
    return this.templateRepo.save(template);
  }

  async remove(id: number): Promise<any> {
    const template = await this.findOne(id);
    await this.templateRepo.remove(template);
     return {
      success: true,
      message: 'Template deleted successfully',
    };
  }
}