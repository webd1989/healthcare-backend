import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { User } from '../auth/user.entity';
import { Hospital } from '../hospitals/hospital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Hospital])],
  providers: [StaffsService],
  controllers: [StaffsController],
})
export class StaffsModule {}