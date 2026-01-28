import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patients } from './patients.entity';
import { Hospital } from '../hospitals/hospital.entity';
import { User } from '../auth/user.entity';
import { ClinicAIService } from '../common/clinic-ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patients,Hospital,User])],
  providers: [PatientsService, ClinicAIService],
  controllers: [PatientsController],
  exports: [ClinicAIService], // Export so other modules can use it
})
export class PatientsModule {}