import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientformsService } from './patientforms.service';
import { PatientformsController } from './patientforms.controller';
import { Patientform } from './patientforms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patientform])],
  providers: [PatientformsService],
  controllers: [PatientformsController],
})
export class PatientformsModule {}