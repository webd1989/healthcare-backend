import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { UsersModule } from './users/users.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { Hospital } from './hospitals/hospital.entity';
import { DoctorsModule } from './doctors/doctors.module';
import { StaffsModule } from './staffs/staffs.module';
import { PatientsModule } from './patients/patients.module';
import { MedicinesModule } from './medicines/medicines.module';
import { Medicines } from './medicines/medicines.entity';
import { CountriesModule } from './countries/countries.module';
import { Countries } from './countries/countries.entity';
import { TimezonesModule } from './timezones/timezones.module';
import { Timezones } from './timezones/timezones.entity';
import { PlansModule } from './plans/plans.module';
import { Plans } from './plans/plans.entity';
import { PatientformsModule } from './patientforms/patientforms.module';
import { Patientform } from './patientforms/patientforms.entity';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/role.entity';

import { SuperUsersModule } from './supperusers/supperusers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',   // change if needed
      port: 3306,
      username: 'root',    // your mysql user
      password: '', // your mysql password
      database: 'heathcare_db',
      entities: [User, Hospital, Medicines, Countries, Timezones, Plans, Patientform, Role], // Entities you want to use
      synchronize: true,    // Auto create tables (disable in production)
    }),
    UsersModule,
    AuthModule,
    HospitalsModule,
    DoctorsModule,
    StaffsModule,
    MedicinesModule,
    CountriesModule,
    TimezonesModule,
    PlansModule,
    PatientsModule,
    PatientformsModule,
    RolesModule,
    SuperUsersModule
  ],
})
export class AppModule {}