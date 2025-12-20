import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './hospital.entity';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
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

  async getTotalActiveCount(): Promise<any> {
    try {
      // Count hospitals with status = 1 (active)
      const count = await this.hospitalRepo
        .createQueryBuilder('hospital')
        .where('hospital.status = :status', { status: 1 })
        .getCount();
      
      // Get current date (start of today)
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      // Get start of current month
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentMonthStart.setHours(0, 0, 0, 0);
      
      // Get end of current month
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      
      // Count hospitals created this month (status = 1)
      // Using DATE() function to compare dates properly in SQL
      const thisMonthCount = await this.hospitalRepo
        .createQueryBuilder('hospital')
        .where('hospital.status = :status', { status: 1 })
        .andWhere('YEAR(hospital.created_at) = :year', { year: now.getFullYear() })
        .andWhere('MONTH(hospital.created_at) = :month', { month: now.getMonth() + 1 })
        .getCount();
      
      // Calculate change text
      const changeText = thisMonthCount > 0 ? `+${thisMonthCount} this month` : '0 this month';
      
      console.log('Total active hospitals count (status = 1):', count);
      console.log('Current year:', now.getFullYear());
      console.log('Current month:', now.getMonth() + 1);
      console.log('This month count:', thisMonthCount);
      console.log('Monthly change text:', changeText);
      
      return {
        total: count,
        monthlyChange: thisMonthCount,
        changeText: changeText,
      };
    } catch (error) {
      console.error('Error counting hospitals:', error);
      throw error;
    }
  }

  async getRecentOrganizations(): Promise<any[]> {
    const hospitals = await this.hospitalRepo.find({
      where: { status: 1 },
      order: { created_at: 'DESC' },
      take: 5,
    });

    // Get doctor count for each hospital
    const hospitalsWithDoctorCount = await Promise.all(
      hospitals.map(async (hospital) => {
        const doctorCount = await this.userRepo.count({
          where: {
            hospital_id: hospital.id,
            type: 'Doctor',
          },
        });

        // Get first letter of hospital name for initial
        const initial = hospital.name ? hospital.name.charAt(0).toUpperCase() : 'H';

        // Calculate time ago
        const createdAt = new Date(hospital.created_at);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        let timeAgo = '';
        if (diffMinutes < 1) {
          timeAgo = 'Just now';
        } else if (diffMinutes < 60) {
          timeAgo = `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffHours < 24) {
          timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffDays === 1) {
          timeAgo = '1 day ago';
        } else {
          timeAgo = `${diffDays} days ago`;
        }

        return {
          id: hospital.id,
          name: hospital.name,
          initial: initial,
          users: doctorCount,
          plan: 'Enterprise', // Default plan - can be updated if plan is stored in hospital table
          status: 'active',
          joined: timeAgo,
          created_at: hospital.created_at,
        };
      }),
    );

    return hospitalsWithDoctorCount;
  }
}