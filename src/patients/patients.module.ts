import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}