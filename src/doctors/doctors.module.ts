import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [DoctorsService],
  controllers: [DoctorsController],
})
export class DoctorsModule {}