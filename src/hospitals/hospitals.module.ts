import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { Hospital } from './hospital.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, User])],
  providers: [HospitalsService],
  controllers: [HospitalsController],
})
export class HospitalsModule {}