import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from 'src/auth/user.entity';
import { Patients } from 'src/patients/patients.entity';
import { Patientform } from 'src/patientforms/patientforms.entity';
import { Templates } from 'src/templates/templates.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { log } from 'console';
import * as qs from 'qs';
import FormData from 'form-data';
// @ts-ignore
const XLSX = require('xlsx');
import * as bcrypt from 'bcrypt';

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
    
    @InjectRepository(Templates)
    private readonly TemplatesRepo: Repository<Templates>,

    private readonly configService: ConfigService

  ) {}

  /**
   * Generate appointment number with proper zero-padding
   * Zero-pads only if ID has fewer than 4 digits
   * @param appointmentId - The appointment ID
   * @returns Formatted appointment number (e.g., APPT-0001, APPT-0011, APPT-1111, APPT-11111)
   */
  private generateAppointmentNumber(appointmentId: number): string {
    const idString = String(appointmentId);
    
    // Zero-pad only if ID has fewer than 4 digits
    if (idString.length < 4) {
      return `APPT-${idString.padStart(4, '0')}`;
    }
    
    // If ID has 4 or more digits, use as-is
    return `APPT-${idString}`;
  }

  /**
   * Get doctor user_code for X-Doctor-ID header
   * @param doctorId - The doctor ID
   * @returns Doctor user_code or null if not found or empty
   */
  private async getDoctorUserCode(doctorId: number): Promise<string | null> {
    if (!doctorId || doctorId <= 0) {
      return null;
    }
    
    const doctor = await this.userRepo.findOne({ 
      where: { id: doctorId, type: 'Doctor' } 
    });
    
    if (!doctor || !doctor.user_code || doctor.user_code.trim() === '') {
      return null;
    }
    
    return doctor.user_code;
  }

  async create(dto: CreateAppointmentDto): Promise<any> {

    try {
      // Get doctor user_code for X-Doctor-ID header
      const doctorUserCode = await this.getDoctorUserCode(Number(dto.doctor_id));
      
      if (!doctorUserCode) {
        console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
        // Skip API call if user_code is empty
      } else {
        const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
        const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
        console.log('🔵 [API-4] Calling: POST /patients/ - Create Patient (Appointment)');
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
            doctor_id: doctorUserCode,
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-API-Key': ClinicAIID,
              'X-Doctor-ID': doctorUserCode,
            },
          },
        );

        const externalData = externalResponse.data?.data;
        dto.patient_id = externalData?.patient_id;
        dto.visit_id = externalData?.visit_id;
        
        // Save first_question to patient record if patient exists
        if (externalData?.first_question && dto.user_id) {
          try {
            const patient = await this.patientsRepo.findOne({ 
              where: { id: Number(dto.user_id) } 
            });
            if (patient) {
              await this.patientsRepo.update(patient.id, { 
                first_question: externalData.first_question,
                patient_id: externalData.patient_id 
              });
            }
          } catch (updateError) {
            console.error('❌ Failed to update patient first_question:', updateError);
          }
        }
      }
  
      // console.log(dto);
      
      // console.log('External API Response:', externalResponse.data);
    } catch (error) {
      console.error('❌ [API-4] External API call failed:', error.response?.data || error.message);
      // Optionally: return error or continue even if external call fails
    }

    const appointment = this.appointmentRepo.create(dto);
    const saved = await this.appointmentRepo.save(appointment);

      // Step 2️⃣: Generate appointment number with proper formatting
      const appointment_no = this.generateAppointmentNumber(saved.id);

      // Step 3️⃣: Update the same row
      await this.appointmentRepo.update(saved.id, { appointment_no: appointment_no });
    
     return {
      success: true,
      message: 'Appointment created successfully',
      data: saved,
    };
  }

 async createPatient(data: Partial<Patients>): Promise<Patients> {

  //  try {
  //       // Get doctor user_code for X-Doctor-ID header
  //       const doctorUserCode = data.doctor_id ? await this.getDoctorUserCode(data.doctor_id) : null;
        
  //       if (!doctorUserCode) {
  //         console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
  //         // Skip API call if user_code is empty
  //       } else {
  //         const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
  //         const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
          
  //         console.log('🔵 [API-5] Calling: POST /patients/ - Create Patient (createPatient)');
  //         const externalResponse = await axios.post(baseUrl+'patients/',
  //           {
  //             first_name: data.first_name,
  //             last_name: data.last_name,
  //             mobile: data.mobile,
  //             age: data.age,
  //             gender: data.gender,
  //             recently_travelled: data.recently_travelled ?? false,
  //             consent: data.consent ?? true,
  //             country: data.country ?? 'US',
  //             language: data.language ?? 'en',
  //             doctor_id: doctorUserCode,
  //           },
  //           {
  //             headers: {
  //               Accept: 'application/json',
  //               'Content-Type': 'application/json',
  //               'X-API-Key': ClinicAIID,
  //               'X-Doctor-ID': doctorUserCode,
  //             },
  //           },
  //         );
  
  //         const externalData = externalResponse.data?.data;
  
  //         data.patient_id = externalData?.patient_id;
  //         data.visit_id = externalData?.visit_id;
  //         data.first_question = externalData?.first_question;
  //       }
  
  //      // console.log(dto);
        
  //      // console.log('External API Response:', externalResponse.data);
  //     } catch (error) {
  //       console.error('❌ [API-5] External API call failed:', error.response?.data || error.message);
  //       // Optionally: return error or continue even if external call fails
  //     }

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
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
    
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
      return { vitals };
    }

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    console.log('🔵 [API-6] Calling: GET /patients/{patient_id}/visits/{visit_id}/vitals - Get Vitals');
    const externalResponse = await axios.get(baseUrl+'/patients/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/vitals?doctor_id='+doctorUserCode,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
          'X-Doctor-ID': doctorUserCode,
        },
      },
    );
    vitals = externalResponse.data; 
  } catch (error) {
    console.error('❌ [API-6] External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { vitals };
}


async findOne(id: number): Promise<any> {
  if (!id || isNaN(id) || id <= 0) {
    throw new NotFoundException(`Invalid appointment ID: ${id}`);
  }
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
        // Get doctor user_code for X-Doctor-ID header
        const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
        
        if (!doctorUserCode) {
          console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
        } else {
          const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
          const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
          
          console.log('🔵 [API-7] Calling: POST /patients/summary/previsit - Previsit Summary');
          const externalResponse = await axios.post(baseUrl+'patients/summary/previsit',
            {
              patient_id: appointment.patient_id,
              visit_id: appointment.visit_id,
              doctor_id: doctorUserCode,
            },
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': ClinicAIID,
                'X-Doctor-ID': doctorUserCode,
              },
            },
          );
          
          await this.appointmentRepo.update(appointment.id, { previsit_created: "Yes" });
        }
      } catch (error) {
       // console.error('❌ External API call failed:', error.response?.data || error.message);
        // Optionally: return error or continue even if external call fails
      }

  }

  // Generate Postvisit Summary if SOAP is generated and postvisit not yet created
  if(appointment.soap_generated == "Yes" && appointment.postvisit_created == "No"){

    try {
        // Get doctor user_code for X-Doctor-ID header
        const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
        
        if (!doctorUserCode) {
          console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
        } else {
          const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
          const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
          
          console.log('🔵 [API-7B] Calling: POST /patients/summary/postvisit - Postvisit Summary');
          const externalResponse = await axios.post(baseUrl+'patients/summary/postvisit',
            {
              patient_id: appointment.patient_id,
              visit_id: appointment.visit_id,
              doctor_id: doctorUserCode,
            },
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-API-Key': ClinicAIID,
                'X-Doctor-ID': doctorUserCode,
              },
            },
          );
          
          await this.appointmentRepo.update(appointment.id, { postvisit_created: "Yes" });
        }
      } catch (error) {
       // console.error('❌ External API call failed:', error.response?.data || error.message);
        // Optionally: return error or continue even if external call fails
      }

  }

 let summaryData = [];
 let postvisitData = [];
  if(appointment.previsit_created == "Yes"){
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
      
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API calls skipped.');
    } else {
      try {
        const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
        const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
        
        console.log('🔵 [API-8] Calling: GET /patients/{patient_id}/visits/{visit_id}/summary - Get Summary');
        const externalResponse = await axios.get(baseUrl+'/patients/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/summary',
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-API-Key': ClinicAIID,
              'X-Doctor-ID': doctorUserCode,
            },
          },
        );
        summaryData = externalResponse.data;    
        
      } catch (error) {
        //console.error('❌ External API call failed:', error.response?.data || error.message);
        // Optionally: return error or continue even if external call fails
      }

    
      try {
        const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
        const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
        console.log('🔵 [API-9] Calling: GET /patients/{patient_id}/visits/{visit_id}/summary/postvisit - Get Postvisit Summary');
        const externalResponse = await axios.get(baseUrl+'/patients/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/summary/postvisit',
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-API-Key': ClinicAIID,
              'X-Doctor-ID': doctorUserCode,
            },
          },
        );
        postvisitData = externalResponse.data;  
      } catch (error) {
        //console.error('❌ External API call failed:', error.response?.data || error.message);
        // Optionally: return error or continue even if external call fails
      }
    }
}

  return { ...appointment, patientForm, patient, summaryData, postvisitData };
}

  async update(id: number, dto: UpdateAppointmentDto): Promise<any> {
    if (!id || isNaN(id) || id <= 0) {
      throw new NotFoundException(`Invalid appointment ID: ${id}`);
    }
    const appointment = await this.findOne(id);
    Object.assign(appointment, dto);
    return this.appointmentRepo.save(appointment);
  }

async updateVitals(id: number, dto: UpdateAppointmentDto): Promise<any> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, dto);

    try {
      // Get doctor user_code for X-Doctor-ID header
      const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
      
      if (!doctorUserCode) {
        console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
        return false;
      }

      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
      const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');

      // Build full API URL EXACTLY like your curl command
      const apiUrl = `${baseUrl}patients/${appointment.patient_id}/visits/${appointment.visit_id}/vitals`;

      const vitals = dto.appointment_vitals
      ? JSON.parse(dto.appointment_vitals)
      : {};
      console.log('🔵 [API-10] Calling: POST /patients/{patient_id}/visits/{visit_id}/vitals - Update Vitals');
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
          doctor_id: doctorUserCode,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': ClinicAIID, // REQUIRED
            'X-Doctor-ID': doctorUserCode,
          },
        }
      );

      console.log('Vitals Saved ✔️', externalResponse.data);

      return this.appointmentRepo.save(appointment);

    } catch (error) {
      console.error('❌ [API-10] External API call failed:', error.response?.data || error.message);
    }

    return false;
}


async saveTranscribe(id: number, file: Express.Multer.File, template: string): Promise<any> {
  const appointment = await this.findOne(id);

  try {
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
    
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
      return null;
    }

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');

    const apiUrl = `${baseUrl}notes/transcribe`;
    
    console.log('🔵 [API-11] Calling: POST /notes/transcribe - Save Transcribe');
    const formData = new FormData();
    formData.append('patient_id', appointment.patient_id);
    formData.append('visit_id', appointment.visit_id);
    formData.append('doctor_id', doctorUserCode);
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
        'X-Doctor-ID': doctorUserCode,
        'Accept': 'application/json',  
      },
    });

    console.log('Transcribe API response:', externalResponse.data);

    let status = externalResponse.data.status ?? "pending";
    await this.appointmentRepo.update(id, { transcribe_status: status, template_id:template });

    // Postvisit summary will be generated automatically in findOne method 
    // when soap_generated == "Yes" and postvisit_created == "No"

    return externalResponse.data;

  } catch (error: any) {
    console.error("❌ [API-11] External API call failed:");
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
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
    
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
      return { trancribe_data };
    }

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    console.log('🔵 [API-13] Calling: GET /notes/transcribe/status/{patient_id}/{visit_id} - Get Transcribe Status');
    const externalResponse = await axios.get(baseUrl+'notes/transcribe/status/'+appointment.patient_id+'/'+appointment.visit_id+'?doctor_id='+doctorUserCode,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
          'X-Doctor-ID': doctorUserCode,
        },
      },
    );
    trancribe_data = externalResponse.data; 
    status = externalResponse.data.data.status ?? "pending";
    await this.appointmentRepo.update(id, { transcribe_status: status });
    
  } catch (error) {
    console.error('❌ [API-13] External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { trancribe_data };
}

async getTranscribeSummary(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let trancribe_data:any = [];

  try {
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
    
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
      return { trancribe_data };
    }

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    console.log('🔵 [API-14] Calling: GET /notes/{patient_id}/visits/{visit_id}/dialogue - Get Transcribe Summary');
    const externalResponse = await axios.get(baseUrl+'notes/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/dialogue?doctor_id='+doctorUserCode,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
          'X-Doctor-ID': doctorUserCode,
        },
      },
    );
    trancribe_data = externalResponse.data;
    
    //status = externalResponse.data.data.status ?? "pending";
    await this.appointmentRepo.update(id, { transcribe_status: trancribe_data.data.transcription_status });
    
  } catch (error) {
    console.error('❌ [API-14] External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { trancribe_data };
}

async generateSoapNotes(id: number, template_id: string): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let trancribe_data:any = [];

  try {
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
    
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
      return false;
    }

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    let templatesData:any = null;
    const templateRow = await this.TemplatesRepo.findOne({
      where: { id: Number(template_id) },
      select: [
        'template_name',
        'description',
        'category',
        'speciality',
        'subjective',
        'objective',
        'assessment',
        'plan',
        'tags',
        'appointment_type',
        'is_favorite',
      ],
    });

    if (templateRow) {
      templatesData = { ...templateRow };
    }

    console.log({
      patient_id: appointment.patient_id,
      visit_id: appointment.visit_id,
      transcript: null,
      template_data: templatesData,
    });
    
    console.log('🔵 [API-15] Calling: POST /notes/soap/generate - Generate SOAP Notes');
    const externalResponse = await axios.post(baseUrl+'notes/soap/generate',
        {
          patient_id: appointment.patient_id,
          visit_id: appointment.visit_id,
          doctor_id: doctorUserCode,
          transcript: null,
          template_data:templatesData
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': ClinicAIID,
            'X-Doctor-ID': doctorUserCode,
          },
        },
      );

      const externalData = externalResponse.data;
      //status = externalResponse.data.data.status ?? "pending";
      await this.appointmentRepo.update(id, { soap_generated: "Yes" });
      return externalData;
  
    } catch (error) {
      console.error('❌ [API-15] External API call failed:', error.response?.data || error.message);
      // Optionally: return error or continue even if external call fails
    }

  return true;
}

async getSoapNotes(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let soap_summary:any = [];

  try {
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
    
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
      return { soap_summary };
    }

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    console.log('🔵 [API-16] Calling: GET /notes/{patient_id}/visits/{visit_id}/soap - Get SOAP Notes');
    // Try POST with doctor_id in body (similar to API-15 soap/generate)
    const externalResponse = await axios.get(baseUrl+'notes/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/soap',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
          'X-Doctor-ID': doctorUserCode,
        },
      },
    );
    soap_summary = externalResponse.data;
    
    //status = externalResponse.data.data.status ?? "pending";
    //await this.appointmentRepo.update(id, { transcribe_status: trancribe_data.data.transcription_status });
    
  } catch (error) {
    console.error('❌ [API-16] External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { soap_summary };
}

async getAudioFiles(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let audioFIles:any = [];

  try {
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
    
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
      return { audioFIles };
    }

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    console.log('🔵 [API-17] Calling: GET /audio/files - Get Audio Files');
    const externalResponse = await axios.get(baseUrl+'audio/files?doctor_id='+doctorUserCode,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
          'X-Doctor-ID': doctorUserCode,
        },
      },
    );
    audioFIles = externalResponse.data;

  } catch (error) {
    console.error('❌ [API-17] External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { audioFIles };
}

async uploadImages(id: number, files: Express.Multer.File[]): Promise<any> {
  const appointment = await this.findOne(id);

  try {
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
    
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
      throw new Error('Doctor user_code is empty. API call cannot be made.');
    }

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');

    const apiUrl = `${baseUrl}/patients/webhook/images`;
    
    console.log('🔵 [API-18] Calling: POST /patients/webhook/images - Upload Images');
    const formData = new FormData();
    formData.append('patient_id', appointment.patient_id);
    formData.append('visit_id', appointment.visit_id);
    formData.append('doctor_id', doctorUserCode);
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
        'X-Doctor-ID': doctorUserCode,
        'Accept': 'application/json',
      },
    });

    console.log('API Response:', externalResponse.data);

    return externalResponse.data;

  } catch (error: any) {
    console.error("❌ [API-18] External API Error:");
    console.error(error.response?.data || error.message);

    throw new Error(`External API upload failed: ${error.message}`);
  }
}

async getImages(id: number): Promise<any> {
  const appointment = await this.appointmentRepo.findOne({ where: { id } });
  if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
  let images:any = [];

  try {
    // Get doctor user_code for X-Doctor-ID header
    const doctorUserCode = await this.getDoctorUserCode(Number(appointment.doctor_id));
    
    if (!doctorUserCode) {
      console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
      return { images };
    }

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
    const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
    
    
    console.log('🔵 [API-19] Calling: GET /patients/{patient_id}/visits/{visit_id}/images - Get Images');
    const externalResponse = await axios.get(baseUrl+'/patients/'+appointment.patient_id+'/visits/'+appointment.visit_id+'/images?doctor_id='+doctorUserCode,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': ClinicAIID,
          'X-Doctor-ID': doctorUserCode,
        },
      },
    );
    images = externalResponse.data;

  } catch (error) {
    console.error('❌ [API-19] External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }

  return { images };
}

async removeImage(id: string, doctorId?: number): Promise<any> {

  try {
    // If doctorId is provided, validate doctor user_code
    if (doctorId) {
      const doctorUserCode = await this.getDoctorUserCode(doctorId);
      
      if (!doctorUserCode) {
        console.error('❌ Doctor user_code is empty or doctor not found. API call skipped.');
        return {
          success: false,
          message: 'Doctor user_code is empty. API call cannot be made.',
        };
      }

      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
      const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
      console.log('🔵 [API-20] Calling: DELETE /patients/images/{id} - Remove Image');
      const externalResponse = await axios.delete(baseUrl+'patients/images/'+id+'?doctor_id='+doctorUserCode,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': ClinicAIID,
            'X-Doctor-ID': doctorUserCode,
          },
        },
      );
      console.log(externalResponse.data);
    } else {
      // If doctorId is not provided, skip the API call
      console.error('❌ Doctor ID not provided. API call skipped.');
      return {
        success: false,
        message: 'Doctor ID is required for API call.',
      };
    }
  } catch (error) {
    console.error('❌ External API call failed:', error.response?.data || error.message);
    // Optionally: return error or continue even if external call fails
  }
  return {
    success: true,
    message: 'Image deleted successfully',
  };
}

async generateSampleFile(): Promise<Buffer> {
  try {
    const sampleData = [
      {
        'Patient Mobile Number': '1234567890',
        'Patient First Name': 'John',
        'Patient Last Name': 'Doe',
        'Patient Age': '30',
        'Patient Country': 'US',
        'Patient Language': 'en',
        'Gender': 'Male',
        'Recently Travelled': 'No',
        'Consent': 'Yes',
        'Appointment Date': '2024-12-31',
        'Appointment Time': '10:00:00',
        'Visit Type': 'General Pre-visit',
        'Chief Complaint': 'Regular checkup'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  } catch (error) {
    console.error('Error in generateSampleFile:', error);
    throw new Error(`Failed to generate sample file: ${error.message}`);
  }
}

async importFromExcel(file: Express.Multer.File, doctorId: number): Promise<any> {
  if (!doctorId || isNaN(doctorId) || doctorId <= 0) {
    throw new Error('Valid doctor_id is required');
  }
  
  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [] as any[]
  };

  for (let i = 0; i < data.length; i++) {
    const row: any = data[i];
    try {
      // Helper function to parse date from Excel
      const parseDate = (dateValue: any): string => {
        if (!dateValue) return '';
        
        // If it's already a string in DD-MM-YYYY format
        if (typeof dateValue === 'string') {
          // Try to parse DD-MM-YYYY format
          const parts = dateValue.split(/[-\/]/);
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
            return `${year}-${month}-${day}`;
          }
          // If it's already in YYYY-MM-DD format
          if (dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateValue;
          }
        }
        
        // If it's an Excel serial date number
        if (typeof dateValue === 'number') {
          // Excel epoch starts from January 1, 1900
          const excelEpoch = new Date(1899, 11, 30);
          const date = new Date(excelEpoch.getTime() + dateValue * 86400000);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        
        // If it's a Date object
        if (dateValue instanceof Date) {
          const year = dateValue.getFullYear();
          const month = String(dateValue.getMonth() + 1).padStart(2, '0');
          const day = String(dateValue.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        
        return '';
      };

      // Helper function to parse time from Excel
      const parseTime = (timeValue: any): string => {
        if (!timeValue) return '';
        
        // If it's already a string
        if (typeof timeValue === 'string') {
          // Remove any extra spaces
          timeValue = timeValue.trim();
          
          // If it's in HH:MM:SS format, return as is
          if (timeValue.match(/^\d{2}:\d{2}:\d{2}$/)) {
            return timeValue;
          }
          
          // If it's in HH:MM format, add :00
          if (timeValue.match(/^\d{2}:\d{2}$/)) {
            return timeValue + ':00';
          }
          
          // Try to parse HH:MM:SS from various formats
          const timeMatch = timeValue.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
          if (timeMatch) {
            const hours = timeMatch[1].padStart(2, '0');
            const minutes = timeMatch[2].padStart(2, '0');
            const seconds = timeMatch[3] ? timeMatch[3].padStart(2, '0') : '00';
            return `${hours}:${minutes}:${seconds}`;
          }
        }
        
        // If it's a number (Excel time as fraction of day)
        if (typeof timeValue === 'number' && timeValue < 1) {
          const totalSeconds = Math.round(timeValue * 86400);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        
        // If it's a Date object, extract time
        if (timeValue instanceof Date) {
          const hours = String(timeValue.getHours()).padStart(2, '0');
          const minutes = String(timeValue.getMinutes()).padStart(2, '0');
          const seconds = String(timeValue.getSeconds()).padStart(2, '0');
          return `${hours}:${minutes}:${seconds}`;
        }
        
        return '';
      };

      // Map Excel columns to appointment fields
      const rawDate = row['Appointment Date'] || row['appointment_date'] || '';
      const rawTime = row['Appointment Time'] || row['appointment_time'] || '';
      
      const appointmentData: CreateAppointmentDto = {
        user_mobile: String(row['Patient Mobile Number'] || row['patient_mobile'] || ''),
        user_first_name: String(row['Patient First Name'] || row['patient_first_name'] || ''),
        user_last_name: String(row['Patient Last Name'] || row['patient_last_name'] || ''),
        user_name: `${row['Patient First Name'] || row['patient_first_name'] || ''} ${row['Patient Last Name'] || row['patient_last_name'] || ''}`.trim(),
        user_age: String(row['Patient Age'] || row['patient_age'] || '0'),
        user_country: String(row['Patient Country'] || row['patient_country'] || 'US'),
        user_language: String(row['Patient Language'] || row['patient_language'] || 'en'),
        user_gender: String(row['Gender'] || row['gender'] || 'Male'),
        recently_travelled: String(row['Recently Travelled'] || row['recently_travelled'] || 'No').toLowerCase() === 'yes',
        consent: String(row['Consent'] || row['consent'] || 'Yes').toLowerCase() === 'yes',
        appointment_date: parseDate(rawDate),
        appointment_time: parseTime(rawTime),
        visit_type: String(row['Visit Type'] || row['visit_type'] || ''),
        chief_complaint: String(row['Chief Complaint'] || row['chief_complaint'] || ''),
        doctor_id: String(doctorId),
        user_id: '',
        appointment_no: '',
        patient_id: '',
        template_id: '',
        visit_id: '',
        user_email: '',
        doctor_name: '',
        doctor_email: '',
        fields_data: '',
        question_answers: '',
        appointment_vitals: '',
        previsit_created: '',
        postvisit_created: '',
        transcribe_status: '',
        soap_generated: '',
        quick_notes: '',
        tasks: '',
      };

      // Validate required fields
      if (!appointmentData.user_mobile || !appointmentData.user_first_name || 
          !appointmentData.user_last_name || !appointmentData.appointment_date || 
          !appointmentData.appointment_time || !appointmentData.visit_type || 
          !appointmentData.chief_complaint) {
        throw new Error('Missing required fields');
      }

      // Get doctor
      const doctor = await this.getUserById(doctorId);
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      // Check if patient exists by mobile
      let user: any = await this.patientsRepo.findOne({ 
        where: { mobile: appointmentData.user_mobile, doctor_id: doctorId } 
      });

      if (!user) {
        // Create new patient
        user = await this.createPatient({
          first_name: appointmentData.user_first_name,
          last_name: appointmentData.user_last_name,
          mobile: appointmentData.user_mobile,
          age: String(appointmentData.user_age),
          country: appointmentData.user_country,
          language: appointmentData.user_language,
          recently_travelled: appointmentData.recently_travelled,
          consent: appointmentData.consent,
          gender: appointmentData.user_gender,
          doctor_id: doctorId,
          hospital_id: doctor.hospital_id,
          status: 1,
        });
      }

      appointmentData.user_id = String(user.id);
      appointmentData.user_name = user.first_name + ' ' + user.last_name;
      appointmentData.user_email = user.email || '';
      appointmentData.doctor_name = doctor.name;
      appointmentData.doctor_email = doctor.email;

      // Check for duplicate appointment (same user, date, and time)
      const existingAppointment = await this.appointmentRepo.findOne({
        where: {
          user_id: String(appointmentData.user_id),
          appointment_date: appointmentData.appointment_date,
          appointment_time: appointmentData.appointment_time,
          doctor_id: String(doctorId)
        }
      });

      if (existingAppointment) {
        results.skipped++;
        results.errors.push({
          row: i + 2, // +2 because Excel rows start at 1 and we have header
          error: `Duplicate appointment skipped: Appointment already exists for ${appointmentData.user_name} on ${appointmentData.appointment_date} at ${appointmentData.appointment_time}`
        });
        continue; // Skip this row
      }

      // Create appointment using existing create method
      await this.create(appointmentData);
      results.success++;
    } catch (error: any) {
      results.failed++;
      results.errors.push({
        row: i + 2, // +2 because Excel rows start at 1 and we have header
        error: error.message || 'Unknown error'
      });
    }
  }

  return results;
}

}