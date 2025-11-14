import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from 'src/auth/user.entity';
import { Patients } from 'src/patients/patients.entity';
import { Patientform } from 'src/patientforms/patientforms.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { log } from 'console';
import * as qs from 'qs';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    
    @InjectRepository(Patients)
    private readonly patientsRepo: Repository<Patients>,


    @InjectRepository(Patientform)
    private readonly patientFormRepo: Repository<Patientform>,

    private readonly configService: ConfigService

  ) {}

  async create(dto: CreateAppointmentDto): Promise<any> {

    try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
      const externalResponse = await axios.post(baseUrl+'patients/',
        {
          first_name: dto.user_first_name,
          last_name: dto.user_last_name,
          mobile: dto.user_mobile,
          age: dto.user_age,
          gender: dto.user_gender,
          recently_travelled: dto.recently_travelled ?? false,
          consent: dto.consent ?? true,
          country: 'US',
          language: 'en',
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': ClinicAIID,
          },
        },
      );

      const externalData = externalResponse.data?.data;

      dto.patient_id = externalData?.patient_id;
      dto.visit_id = externalData?.visit_id;
  
      // console.log(dto);
      
      // console.log('External API Response:', externalResponse.data);
    } catch (error) {
      console.error('❌ External API call failed:', error.response?.data || error.message);
      // Optionally: return error or continue even if external call fails
    }

    const appointment = this.appointmentRepo.create(dto);
    const saved = await this.appointmentRepo.save(appointment);
    
     return {
      success: true,
      message: 'Appointment created successfully',
      data: saved,
    };
  }

 async createPatient(data: Partial<Patients>): Promise<Patients> {

   try {
        const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
        const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
        
        const externalResponse = await axios.post(baseUrl+'patients/',
          {
            first_name: data.first_name,
            last_name: data.last_name,
            mobile: data.mobile,
            age: data.age,
            gender: data.gender,
            recently_travelled: data.recently_travelled ?? false,
            consent: data.consent ?? true,
            country: data.country ?? 'US',
            language: data.language ?? 'en',
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-API-Key': ClinicAIID,
            },
          },
        );
  
        const externalData = externalResponse.data?.data;
  
        data.patient_id = externalData?.patient_id;
        data.visit_id = externalData?.visit_id;
        data.first_question = externalData?.first_question;
  
       // console.log(dto);
        
       // console.log('External API Response:', externalResponse.data);
      } catch (error) {
        console.error('❌ External API call failed:', error.response?.data || error.message);
        // Optionally: return error or continue even if external call fails
      }

    const newPatient = this.patientsRepo.create(data); 
  return await this.patientsRepo.save(newPatient);
}

   async getUserById(user_id: any): Promise<User | null> {
      return this.userRepo.findOne({ where: { id: user_id } });
    }
    
    async getPatientById(user_id: any): Promise<Patients | null> {
      return this.patientsRepo.findOne({ where: { id: user_id } });
    }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  async findAPTAll(doctorId?: number): Promise<Appointment[]> {
    const query = this.appointmentRepo.createQueryBuilder('appointment');

    // If doctorId > 0, add filter
    if (doctorId && doctorId > 0) {
      query.andWhere('appointment.doctor_id = :doctorId', { doctorId });
    }

    // Optional: order by date/time
    query.orderBy('appointment.appointment_time', 'ASC');

    // Execute and return results
    return await query.getMany();
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
  
  const patient = await this.patientsRepo.findOne({
    where: { id: Number(appointment.user_id) },
  });

  return { ...appointment, patientForm, patient };
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