import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patients } from './patients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients])],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}