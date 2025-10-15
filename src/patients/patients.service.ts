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

    // Step 2️⃣: Generate user_code (e.g., DTR-0001)
    const userCode = saved.name
      .toLowerCase()                // lowercase
      .trim()                       // remove spaces at ends
      .replace(/\s+/g, '-')         // replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') + // remove invalid characters
    `-${saved.mobile}`;

    // Step 3️⃣: Update the same row
    await this.patientRepo.update(saved.id, { user_code: userCode });

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
        type: 'Patient',
      },
    });
  }

 async getAllPatients(doctor_id: number, user_mobile: string): Promise<User[]> {
    return this.patientRepo.find({
      where: {
        doctor_id: doctor_id,
        mobile: user_mobile,
        type: 'Patient',
      },
    });
  }

  async paginate(
    page: number,
    limit: number,
    searchTitle?: string,
    doctorId?: number,
  ) {
    const query = this.patientRepo.createQueryBuilder('patient');

    // Always filter by type = 'Patient'
    query.where('patient.type = :type', { type: 'Patient' });

    // If doctorId > 0, add filter
    if (doctorId && doctorId > 0) {
      query.andWhere('patient.doctor_id = :doctorId', { doctorId });
    }

    // If searchTitle provided, search by name or email
    if (searchTitle && searchTitle.trim() !== '') {
      query.andWhere(
        '(patient.name LIKE :search OR patient.email LIKE :search)',
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