import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { Hospital } from './hospital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital])],
  providers: [HospitalsService],
  controllers: [HospitalsController],
})
export class HospitalsModule {}