import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from 'src/auth/user.entity';
import { Patientform } from 'src/patientforms/patientforms.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,


    @InjectRepository(Patientform)
    private readonly patientFormRepo: Repository<Patientform>,

  ) {}

  async create(dto: CreateAppointmentDto): Promise<any> {
    const appointment = this.appointmentRepo.create(dto);
    const saved = await this.appointmentRepo.save(appointment);
     return {
      success: true,
      message: 'Appointment created successfully',
      data: saved,
    };
  }

 async createPatient(data: Partial<User>): Promise<User> {
  const newPatient = this.userRepo.create(data); 
  return await this.userRepo.save(newPatient);
}

   async getUserById(user_id: any): Promise<User | null> {
      return this.userRepo.findOne({ where: { id: user_id } });
    }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  async paginate(page: number, limit: number, searchTitle?: string, doctorId?: number) {
      const query = this.appointmentRepo.createQueryBuilder('appointment');

      if (searchTitle) {
        query.where(
          'appointment.user_name LIKE :search OR appointment.user_mobile LIKE :search',
          { search: `%${searchTitle}%` },
        );
      }

      // If doctorId > 0, add filter
      if (doctorId && doctorId > 0) {
        query.andWhere('appointment.doctor_id = :doctorId', { doctorId });
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

async findOne(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);

  const patientForm = await this.patientFormRepo.findOne({
    where: { doctor_id: Number(appointment.doctor_id) },
  });

  return { ...appointment, patientForm };
}

  async update(id: number, dto: UpdateAppointmentDto): Promise<any> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, dto);
    return this.appointmentRepo.save(appointment);
  }

  async remove(id: number): Promise<any> {
    const appointment = await this.findOne(id);
    await this.appointmentRepo.remove(appointment);
     return {
      success: true,
      message: 'Appointment deleted successfully',
    };
  }
}