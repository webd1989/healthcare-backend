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
import FormData from 'form-data';

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

      // Step 2️⃣: Generate user_code (e.g., DTR-0001)
      const appointment_no = `APPT-${String(saved.id).padStart(6, '0')}`;

      // Step 3️⃣: Update the same row
      await this.appointmentRepo.update(saved.id, { appointment_no: appointment_no });
    
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

  async paginate(
  page: number,
  limit: number,
  type?: string,
  doctorId?: number
) {
  const query = this.appointmentRepo.createQueryBuilder('appointment');

  // Search filter
  if (type && !['Scheduled', 'In Progress', 'Completed', 'All'].includes(type)) {
    query.where(
      'appointment.user_name LIKE :search OR appointment.user_mobile LIKE :search',
      { search: `%${type}%` }
    );
  }

  // Doctor filter
  if (doctorId && doctorId > 0) {
    query.andWhere('appointment.doctor_id = :doctorId', { doctorId });
  }

  // Current datetime
  const now = new Date();

  // Combine appointment date + time (MySQL syntax)
  const appointmentDateTime = `STR_TO_DATE(CONCAT(appointment.appointment_date, ' ', appointment.appointment_time), '%Y-%m-%d %H:%i:%s')`;

  // Status filter
  if (type === 'Scheduled') {
    query.andWhere(`${appointmentDateTime} > :now`, { now });
  }

  if (type === 'In Progress') {
    query.andWhere(
      `${appointmentDateTime} <= :now AND DATE_ADD(${appointmentDateTime}, INTERVAL 30 MINUTE) >= :now`,
      { now }
    );
  }

  if (type === 'Completed') {
    query.andWhere(
      `DATE_ADD(${appointmentDateTime}, INTERVAL 30 MINUTE) < :now`,
      { now }
    );
  }

  // Pagination
  const [data, total] = await query
    .orderBy('appointment.appointment_date', 'DESC')
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
  
  async findVitals(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
   let vitals = [];

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    const externalResponse = await axios.get(baseUrl+'/patients/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/vitals',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
        },
      },
    );
    vitals = externalResponse.data; 
  } catch (error) {
    console.error('❌ External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { vitals };
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


  
  if(appointment.visit_id !== "" && appointment.question_answers != '' && appointment.question_answers != null && appointment.previsit_created == 'No'){

    try {
        const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
        const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
        
        const externalResponse = await axios.post(baseUrl+'patients/summary/previsit',
          {
            patient_id: appointment.patient_id,
            visit_id: appointment.visit_id
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-API-Key': ClinicAIID,
            },
          },
        );
      } catch (error) {
       // console.error('❌ External API call failed:', error.response?.data || error.message);
        // Optionally: return error or continue even if external call fails
      }

    await this.appointmentRepo.update(appointment.id, { previsit_created: "Yes" });

  }

 let summaryData = [];
  if(appointment.previsit_created == "Yes"){
    try {
      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
      const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
      
      const externalResponse = await axios.get(baseUrl+'/patients/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/summary',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': ClinicAIID,
          },
        },
      );
      summaryData = externalResponse.data;    
    } catch (error) {
      //console.error('❌ External API call failed:', error.response?.data || error.message);
      // Optionally: return error or continue even if external call fails
    }
}

  return { ...appointment, patientForm, patient, summaryData };
}

  async update(id: number, dto: UpdateAppointmentDto): Promise<any> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, dto);
    return this.appointmentRepo.save(appointment);
  }

async updateVitals(id: number, dto: UpdateAppointmentDto): Promise<any> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, dto);

    try {
  const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
  const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');

    // Build full API URL EXACTLY like your curl command
    const apiUrl = `${baseUrl}patients/${appointment.patient_id}/visits/${appointment.visit_id}/vitals`;

      const vitals = dto.appointment_vitals
      ? JSON.parse(dto.appointment_vitals)
      : {};
      const externalResponse = await axios.post(
        apiUrl,
        {
          bloodPressure: vitals.bloodPressure,
          heartRate: vitals.heartRate,
          temperature: vitals.temperature,
          respiratoryRate: vitals.respiratoryRate,
          oxygenSaturation: vitals.oxygenSaturation,
          weight: vitals.weight,
          height: vitals.height,
          bmi: vitals.bmi,
          notes: vitals.notes,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': ClinicAIID, // REQUIRED
          },
        }
      );

      console.log('Vitals Saved ✔️', externalResponse.data);

      return this.appointmentRepo.save(appointment);

    } catch (error) {
      console.error('❌ External API call failed:', error.response?.data || error.message);
    }

    return false;
}


async saveTranscribe(id: number, file: Express.Multer.File): Promise<any> {
  const appointment = await this.findOne(id);

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');

    const apiUrl = `${baseUrl}notes/transcribe`;
    
    const formData = new FormData();
    formData.append('patient_id', appointment.patient_id);
    formData.append('visit_id', appointment.visit_id);
    formData.append('language', 'en');

    formData.append('audio_file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
      knownLength: file.size,
    });

    const externalResponse = await axios.post(apiUrl, formData, {
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      headers: {
        ...formData.getHeaders(), 
        'X-API-Key': ClinicAIID,     
        'Accept': 'application/json',  
      },
    });

    console.log('Transcribe API response:', externalResponse.data);

    let status = externalResponse.data.status ?? "pending";
    await this.appointmentRepo.update(id, { transcribe_status: status });

    return externalResponse.data;

  } catch (error: any) {
    console.error("❌ External API call failed:");
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);
    console.error("Message:", error.message);

    //throw new Error(External transcription failed: ${error.message});
  }
}

async remove(id: number): Promise<any> {
  const appointment = await this.findOne(id);
  await this.appointmentRepo.remove(appointment);
    return {
    success: true,
    message: 'Appointment deleted successfully',
  };
}

async getDashboardData(
  doctorId?: number
): Promise<Appointment[]> {

  const query = this.appointmentRepo.createQueryBuilder('appointment');
  // 👨‍⚕️ Doctor filter
  if (doctorId && Number.isFinite(doctorId) && doctorId > 0) {
    query.andWhere('appointment.doctor_id = :doctorId', { doctorId });
  }

  // 📅 Today's date filter
  // appointment_date column format: YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  query.andWhere('appointment.appointment_date = :today', { today });

  // Fetch records
  return await query.getMany();
}

async getTranscribeStatus(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let trancribe_data = [];
  let status = "pending";

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    const externalResponse = await axios.get(baseUrl+'notes/transcribe/status/'+appointment.patient_id+'/'+appointment.visit_id,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
        },
      },
    );
    trancribe_data = externalResponse.data; 
    status = externalResponse.data.data.status ?? "pending";
    await this.appointmentRepo.update(id, { transcribe_status: status });
    
  } catch (error) {
    console.error('❌ External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { trancribe_data };
}

async getTranscribeSummary(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let trancribe_data:any = [];

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    const externalResponse = await axios.get(baseUrl+'notes/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/dialogue',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
        },
      },
    );
    trancribe_data = externalResponse.data;
    
    //status = externalResponse.data.data.status ?? "pending";
    await this.appointmentRepo.update(id, { transcribe_status: trancribe_data.data.transcription_status });
    
  } catch (error) {
    console.error('❌ External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { trancribe_data };
}

async generateSoapNotes(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let trancribe_data:any = [];

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');

    const externalResponse = await axios.post(baseUrl+'notes/soap/generate',
        {
          patient_id: appointment.patient_id,
          visit_id: appointment.visit_id,
          transcript: null,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': ClinicAIID,
          },
        },
      );

      const externalData = externalResponse.data;
      //status = externalResponse.data.data.status ?? "pending";
      await this.appointmentRepo.update(id, { soap_generated: "Yes" });
      return externalData;
  
    } catch (error) {
      console.error('❌ External API call failed:', error.response?.data || error.message);
      // Optionally: return error or continue even if external call fails
    }

  return true;
}

async getSoapNotes(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let soap_summary:any = [];

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    const externalResponse = await axios.get(baseUrl+'notes/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/soap',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
        },
      },
    );
    soap_summary = externalResponse.data;
    
    //status = externalResponse.data.data.status ?? "pending";
    //await this.appointmentRepo.update(id, { transcribe_status: trancribe_data.data.transcription_status });
    
  } catch (error) {
    console.error('❌ External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { soap_summary };
}

async getAudioFiles(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let audioFIles:any = [];

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    const externalResponse = await axios.get(baseUrl+'audio/files',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
        },
      },
    );
    audioFIles = externalResponse.data;

  } catch (error) {
    console.error('❌ External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { audioFIles };
}

async uploadImages(id: number, files: Express.Multer.File[]): Promise<any> {
  const appointment = await this.findOne(id);

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');

    const apiUrl = `${baseUrl}/patients/webhook/images`;
    
    const formData = new FormData();
    formData.append('patient_id', appointment.patient_id);
    formData.append('visit_id', appointment.visit_id);
    formData.append('language', 'en');

    // Add multiple images as the API expects (`images`)
    files.forEach(file => {
      formData.append('images', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
        knownLength: file.size
      });
    });

    const externalResponse = await axios.post(apiUrl, formData, {
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': ClinicAIID,
        'Accept': 'application/json',
      },
    });

    console.log('API Response:', externalResponse.data);

    return externalResponse.data;

  } catch (error: any) {
    console.error("❌ External API Error:");
    console.error(error.response?.data || error.message);

    throw new Error(`External API upload failed: ${error.message}`);
  }
}

async getImages(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let images:any = [];

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    const externalResponse = await axios.get(baseUrl+'/patients/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/images',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
        },
      },
    );
    images = externalResponse.data;

  } catch (error) {
    console.error('❌ External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { images };
}

async removeImage(id: string): Promise<any> {

  try {
    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    const externalResponse = await axios.delete(baseUrl+'patients/images/'+id,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
        },
      },
    );
    console.log(externalResponse.data);
  } catch (error) {
    console.error('❌ External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }
  return {
    success: true,
    message: 'Image deleted successfully',
  };
}

}