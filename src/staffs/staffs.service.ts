import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Hospital } from '../hospitals/hospital.entity';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(User)
    private staffRepo: Repository<User>,
    
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
  ) {}

  async create(dto: CreateStaffDto): Promise<any> {
    const staff = this.staffRepo.create(dto);
    const saved = await this.staffRepo.save(staff);

    // Step 2️⃣: Generate user_code (e.g., DTR-0001)
    const userCode = `STF-${String(saved.id).padStart(4, '0')}`;

    // Step 3️⃣: Update the same row
    await this.staffRepo.update(saved.id, { user_code: userCode });
    
     return {
      success: true,
      message: 'Staff created successfully',
      data: saved,
    };
  }

  async findAll(hospital_id: number): Promise<User[]> {
    return this.staffRepo.find({
      where: {
        hospital_id: hospital_id,
        type: 'staff',
      },
    });
  }

  async paginate(page: number, limit: number, searchTitle?: string, doctorId?: number) {
      const query = this.staffRepo.createQueryBuilder('staff');

      // Always filter by type = Staff
      query.where('staff.type = :type', { type: 'Staff' });

      if (searchTitle) {
        query.where(
          'staff.name LIKE :search OR staff.email LIKE :search OR staff.mobile LIKE :search OR staff.user_code LIKE :search',
          { search: `%${searchTitle}%` },
        );
      }

      // If doctorId > 0, add filter
      if (doctorId && doctorId > 0) {
        query.andWhere('staff.doctor_id = :doctorId', { doctorId });
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
                const doctor = await this.staffRepo.findOneBy({
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
        data: result,
        total,
        page,
        limit,
      };
  }

  async findOne(id: number): Promise<User> {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException(`Staff ${id} not found`);
    
    return staff;
  }

  async update(id: number, dto: UpdateStaffDto): Promise<any> {
    const staff = await this.findOne(id);
    Object.assign(staff, dto);
    return this.staffRepo.save(staff);
  }

  async remove(id: number): Promise<any> {
    const staff = await this.findOne(id);
    await this.staffRepo.remove(staff);
     return {
      success: true,
      message: 'Staff deleted successfully',
    };
  }
}