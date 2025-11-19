import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { User } from '../auth/user.entity';
import { Hospital } from '../hospitals/hospital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Hospital])],
  providers: [DoctorsService],
  controllers: [DoctorsController],
})
export class DoctorsModule {}