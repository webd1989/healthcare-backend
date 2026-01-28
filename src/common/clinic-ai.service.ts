import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from '../auth/user.entity';

@Injectable()
export class ClinicAIService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Get doctor user_code by doctor ID
   */
  async getDoctorUserCode(doctorId: number): Promise<string | null> {
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

  /**
   * Generate previsit summary
   * Common method that can be used by both appointments and patients services
   */
  async generatePrevisitSummary(
    patientId: string,
    visitId: string,
    doctorId: number,
    updateCallback?: (data: any) => Promise<void>,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Get doctor user_code for X-Doctor-ID header
      const doctorUserCode = await this.getDoctorUserCode(doctorId);
      
      if (!doctorUserCode) {
        console.error('❌ Doctor user_code is empty or doctor not found. Previsit summary API call skipped.');
        return {
          success: false,
          message: 'Doctor user_code is empty or doctor not found',
        };
      }

      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL');
      const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY');
      
      console.log('🔵 [API-7] Calling: POST /patients/summary/previsit - Previsit Summary');
      const externalResponse = await axios.post(
        `${baseUrl}patients/summary/previsit`,
        {
          patient_id: patientId,
          visit_id: visitId,
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
      
      // If update callback is provided, call it (e.g., to update appointment.previsit_created)
      if (updateCallback) {
        await updateCallback(externalResponse.data);
      }
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('❌ [API-7] Previsit summary API call failed:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data || error.message,
      };
    }
  }
}
