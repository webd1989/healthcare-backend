import { Injectable, NotFoundException, BadRequestException   } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './update-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { UpdateSoapSummarySettingsDto } from './update-soap-summary-settings.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  async findById(id: number): Promise<User> {
    const userData:any = this.usersRepo.findOne({ where: { id } });
    return userData;
  }

  async updateProfile(userId: number, updateUser: UpdateUserDto): Promise<User> {    
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateUser);
    return this.usersRepo.save(user);
  }

  async updateSoapSummarySettings(
    userId: number,
    dto: UpdateSoapSummarySettingsDto,
  ): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

     // Preserve any existing keys already stored in this JSON column.
     let existing: any = {};
     try {
       if (user.soap_summary_settings) existing = JSON.parse(user.soap_summary_settings);
     } catch (e) {
       existing = {};
     }

     // Merge: keep existing values unless DTO explicitly provides them.
     const next: any = { ...existing };
     if (dto?.soapSummaryOrder !== undefined) next.soapSummaryOrder = dto.soapSummaryOrder;
     if (dto?.preVisitConfig !== undefined) next.preVisitConfig = dto.preVisitConfig;
     if (dto?.categories !== undefined) next.categories = dto.categories;
     if (dto?.max_questions !== undefined) next.max_questions = dto.max_questions;
     if (dto?.global_categories !== undefined) next.global_categories = dto.global_categories;
     if (dto?.pre_visit_ai_config !== undefined) next.pre_visit_ai_config = dto.pre_visit_ai_config;
     if (dto?.soap_ai_config !== undefined) next.soap_ai_config = dto.soap_ai_config;
     next.max_questions = 10;
     user.soap_summary_settings = JSON.stringify(next);

     // Build AI payload: "key exists -> send value, else blank"
     const soapOrder = Array.isArray(next?.soapSummaryOrder) ? next.soapSummaryOrder : [];

     const buildPreVisitConfig = (cfg: any): any[] => {
       if (!cfg || typeof cfg !== 'object') return [];

       const list: any[] = [];

       const sectionOnly = (section_key: string, enabled: any) => ({
         section_key,
         enabled: !!enabled,
         selected_fields: !!enabled ? [section_key] : [],
       });

       // chief complaint
       if (cfg.chiefComplaint !== undefined) {
         list.push(sectionOnly('chief_complaint', cfg.chiefComplaint));
       }

       // HPI
       if (cfg.hpi && typeof cfg.hpi === 'object') {
         const enabled = !!cfg.hpi.enabled;
         const fields = cfg.hpi.fields && typeof cfg.hpi.fields === 'object' ? cfg.hpi.fields : {};
         const selected_fields = enabled
           ? Object.keys(fields).filter((k) => fields[k] === true)
           : [];
         list.push({
           section_key: 'hpi',
           enabled,
           selected_fields,
         });
       }

       // History
       if (cfg.history && typeof cfg.history === 'object') {
         const enabled = !!cfg.history.enabled;
         const fields = cfg.history.fields && typeof cfg.history.fields === 'object' ? cfg.history.fields : {};
         const selected_fields = enabled
           ? Object.keys(fields).filter((k) => fields[k] === true)
           : [];
         list.push({
           section_key: 'history',
           enabled,
           selected_fields,
         });
       }

       // ROS + current medication
       if (cfg.reviewOfSystems !== undefined) {
         list.push(sectionOnly('review_of_systems', cfg.reviewOfSystems));
       }
       if (cfg.currentMedication !== undefined) {
         list.push(sectionOnly('current_medication', cfg.currentMedication));
       }

       return list;
     };

     const preVisitConfigArr = Array.isArray(next?.pre_visit_config)
       ? next.pre_visit_config
       : buildPreVisitConfig(next?.preVisitConfig);

     const preVisitAiConfig =
       next?.pre_visit_ai_config && typeof next.pre_visit_ai_config === 'object'
         ? next.pre_visit_ai_config
         : { style: '', focus_areas: [], include_red_flags: false };

     const soapAiConfig =
       next?.soap_ai_config && typeof next.soap_ai_config === 'object'
         ? next.soap_ai_config
         : { detail_level: '', formatting: '', language: '' };

     const aiPayload = {
       doctor_id: user.user_code ? String(user.user_code) : '',
       soap_order: soapOrder,
       pre_visit_config: preVisitConfigArr,
       categories: Array.isArray(next?.categories) ? next.categories : [],
       max_questions: typeof next?.max_questions === 'number' ? next.max_questions : 0,
       global_categories: Array.isArray(next?.global_categories) ? next.global_categories : [],
       pre_visit_ai_config: preVisitAiConfig,
       soap_ai_config: soapAiConfig,
     };

     // Call ClinicAI (do not block saving if it fails)
     try {
       const baseUrl = this.configService.get<string>('NEXT_PUBLIC_CLINIC_AI_BASE_URL') || '';
       const ClinicAIID = this.configService.get<string>('CLINIC_AI_KEY') || '';

       if (baseUrl) {
         const url = baseUrl.endsWith('/')
           ? `${baseUrl}doctor/preferences`
           : `${baseUrl}/doctor/preferences`;

         const externalResponse = await axios.post(url, aiPayload, {
           headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json',
             'X-API-Key': ClinicAIID,
           },
         });

         // Keep logs light
         //console.log('ClinicAI previsit summary settings updated:', externalResponse?.data?.data); 
       }
     } catch (error: any) {
       // Do not block saving if ClinicAI call fails, but print error for debugging.
       const status = error?.response?.status;
       const data = error?.response?.data;
       const message = error?.message;
       console.error('ClinicAI previsit summary settings update failed:', {
         status,
         message,
         data,
       });
     }

    return this.usersRepo.save(user);
  }

   async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    // Compare current password
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Current password is incorrect');

    // Hash new password
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;

    await this.usersRepo.save(user);

    return { message: 'Password updated successfully',success: true };
  }

  async getActiveUsersCount(): Promise<any> {
    try {
      // Count users with type = 'Doctor' and status = 1
      const count = await this.usersRepo
        .createQueryBuilder('user')
        .where('user.type = :type', { type: 'Doctor' })
        .andWhere('user.status = :status', { status: 1 })
        .getCount();
      
      // Get current date
      const now = new Date();
      
      // Count doctors created this month (type = 'Doctor' and status = 1)
      const thisMonthCount = await this.usersRepo
        .createQueryBuilder('user')
        .where('user.type = :type', { type: 'Doctor' })
        .andWhere('user.status = :status', { status: 1 })
        .andWhere('YEAR(user.created_at) = :year', { year: now.getFullYear() })
        .andWhere('MONTH(user.created_at) = :month', { month: now.getMonth() + 1 })
        .getCount();
      
      // Calculate change text
      const changeText = thisMonthCount > 0 ? `+${thisMonthCount} this month` : '0 this month';
      
      console.log('Total active doctors count (type = Doctor, status = 1):', count);
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
      console.error('Error counting active users:', error);
      throw error;
    }
  }

}