import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patients } from './patients.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { log } from 'console';
import * as qs from 'qs';
import { User } from '../auth/user.entity';
import { Hospital } from '../hospitals/hospital.entity';


@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patients)
    private patientRepo: Repository<Patients>,
    
    @InjectRepository(Hospital)
    private hospitalRepo: Repository<Hospital>,
    
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private readonly configService: ConfigService
  ) {}

  async create(dto: CreatePatientDto): Promise<any> {

     try {
      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
      const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
      
      const externalResponse = await axios.post(baseUrl+'patients/',
        {
          first_name: dto.first_name,
          last_name: dto.last_name,
          mobile: dto.mobile,
          age: dto.age,
          gender: dto.gender,
          recently_travelled: dto.recently_travelled ?? false,
          consent: dto.consent ?? true,
          country: dto.country ?? 'US',
          language: dto.language ?? 'en',
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
      dto.first_question = externalData?.first_question;

     // console.log(dto);
      
     // console.log('External API Response:', externalResponse.data);
    } catch (error) {
      console.error('❌ External API call failed:', error.response?.data || error.message);
      // Optionally: return error or continue even if external call fails
    }

  
    const patient = this.patientRepo.create(dto);

    const saved = await this.patientRepo.save(patient);

    // // Step 2️⃣: Generate user_code (e.g., DTR-0001)
    // const userCode = saved.name
    //   .toLowerCase()                // lowercase
    //   .trim()                       // remove spaces at ends
    //   .replace(/\s+/g, '-')         // replace spaces with hyphens
    //   .replace(/[^a-z0-9-]/g, '') + // remove invalid characters
    // `-${saved.mobile}`;

    // // Step 3️⃣: Update the same row
    // await this.patientRepo.update(saved.id, { user_code: userCode });

     return {
      success: true,
      message: 'Patient created successfully',
      data: saved,
    };
  }


  async consultationsAnswer(formData:any): Promise<any> {

     try {
      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
      const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
       // Use qs to encode form data like curl -d does
        const formBody = qs.stringify({
          form_patient_id: formData.form_patient_id,
          form_visit_id: formData.form_visit_id,
          form_answer: formData.form_answer,
        });

        const externalResponse = await axios.post(
          `${baseUrl}patients/consultations/answer`,
          formBody,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-API-Key': ClinicAIID,
            },
          },
        );

       const externalData = externalResponse.data;       
      
      return {
        success: true,
        message: 'Answer submitted successfully',
        data: externalData,
      };

     // console.log(dto);
      
     // console.log('External API Response:', externalResponse.data);
    } catch (error) {
      console.error('❌ External API call failed:', error.response?.data || error.message);
      // Optionally: return error or continue even if external call fails
      return {
      success: false,
      message: error.response?.data || error.message,
    };
    } 
  }

  async consultationsAnswerEdit(formData:any): Promise<any> {

     try {
      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
      const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
       // Use qs to encode form data like curl -d does
       const externalResponse = await axios.patch(
        `${baseUrl}patients/consultations/answer`,
        {
          patient_id: formData.form_patient_id,
          visit_id: formData.form_visit_id,
          question_number: formData.question_number,
          new_answer: formData.form_answer,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': ClinicAIID,
          },
        }
      );

       const externalData = externalResponse.data;       
      
      return {
        success: true,
        message: 'Answer updated successfully',
        data: externalData,
      };

     // console.log(dto);
      
     // console.log('External API Response:', externalResponse.data);
    } catch (error) {
      console.error('❌ External API call failed:', error.response?.data || error.message);
      // Optionally: return error or continue even if external call fails
      return {
      success: false,
      message: error.response?.data || error.message,
    };
    } 
  }

  async findAll(hospital_id: number): Promise<Patients[]> {
    return this.patientRepo.find({
      where: {
        hospital_id: hospital_id,
      },
    });
  }

 async getAllPatients(doctor_id: number, user_mobile: string): Promise<Patients[]> {
    return this.patientRepo.find({
      where: {
        doctor_id: doctor_id,
        mobile: user_mobile,
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
    //query.where('patient.type = :type', { type: 'Patient' });

    // If doctorId > 0, add filter
    if (doctorId && doctorId > 0) {
      query.andWhere('patient.doctor_id = :doctorId', { doctorId });
    }

    // If searchTitle provided, search by name or email
    if (searchTitle && searchTitle.trim() !== '') {
      query.andWhere(
        '(patient.first_name LIKE :search OR patient.last_name LIKE :search OR  patient.mobile LIKE :search)',
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

  async findOne(id: number): Promise<Patients> {
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