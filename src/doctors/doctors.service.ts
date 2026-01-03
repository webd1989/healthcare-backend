import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateDoctorDtoSignup } from './dto/create-doctor-singup.dto';
import { Hospital } from '../hospitals/hospital.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(User)
    private doctorRepo: Repository<User>,

    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
  ) {}

  async create(dto: CreateDoctorDto): Promise<any> {
    const doctor = this.doctorRepo.create(dto);
    const saved = await this.doctorRepo.save(doctor);

    // Step 2️⃣: Generate user_code (e.g., DTR-0001)
    const userCode = `DTR-${String(saved.id).padStart(4, '0')}`;

    // Step 3️⃣: Update the same row
    await this.doctorRepo.update(saved.id, { user_code: userCode });
   
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
      order: {
        id: 'DESC'
      }
    });
  }

async paginate(page: number, limit: number, searchTitle?: string, searchStatus?:number) {
  const query = this.doctorRepo.createQueryBuilder('doctor');

  // Always filter by type = Doctor
  query.where('doctor.type = :type', { type: 'Doctor' });

  if (searchTitle) {
    query.andWhere(
      'doctor.name LIKE :search OR doctor.email LIKE :search OR doctor.mobile LIKE :search OR doctor.user_code LIKE :search',
      { search: `%${searchTitle}%` },
    );
  }

  // If searchStatus > 0, add filter
  if (searchStatus && searchStatus > 0) {
    query.andWhere('staff.status = :searchStatus', { searchStatus });
  }

  const [data, total] = await query
    .orderBy('doctor.id', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  // Fetch hospital names for each doctor
  const result = await Promise.all(
    data.map(async (doctor) => {
      let hospitalName = '';
      if (doctor.hospital_id) {
        const hospital = await this.hospitalRepo.findOne({
          where: { id: doctor.hospital_id },
          select: ['name'],
        });
        hospitalName = hospital ? hospital.name : 'N/A';
      }

      return {
        ...doctor,
        hospital_name: hospitalName, // add hospital name
      };
    }),
  );


  // 🔹 Single query to get active & inactive counts
  const statusCountsQuery = this.doctorRepo
    .createQueryBuilder('doctor')
    .select('doctor.status', 'status')
    .addSelect('COUNT(*)', 'count')
    .where('doctor.type = :type', { type: 'Doctor' });

  statusCountsQuery.groupBy('doctor.status');

  const statusCounts = await statusCountsQuery.getRawMany();

  let totalActive = 0;
  let totalInactive = 0;

  // 🔹 Loop through the results
  statusCounts.forEach((row) => {
    if (+row.status === 1) totalActive = +row.count;
    if (+row.status === 2) totalInactive = +row.count;
  });

  return {
    success: true,
    data: result,
    total,
    page,
    limit,
    totalActive,
    totalInactive
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
  
  async createDoctor(dto: CreateDoctorDtoSignup): Promise<any> {
    const doctor = this.doctorRepo.create(dto);
    const saved = await this.doctorRepo.save(doctor);

    // Step 2️⃣: Generate user_code (e.g., DTR-0001)
    const userCode = `DTR-${String(saved.id).padStart(4, '0')}`;

    // Step 3️⃣: Update the same row
    await this.doctorRepo.update(saved.id, { user_code: userCode });
    
     return {
      success: true,
      message: 'Doctor created successfully',
      data: saved,
    };
  }
}