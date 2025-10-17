import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './appointment.entity';
import { User } from 'src/auth/user.entity';
import { Patientform } from 'src/patientforms/patientforms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Patientform])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}