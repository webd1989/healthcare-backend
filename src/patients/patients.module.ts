import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patients } from './patients.entity';
import { Hospital } from '../hospitals/hospital.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients,Hospital,User])],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}