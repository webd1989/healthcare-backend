import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { UsersModule } from './users/users.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { Hospital } from './hospitals/hospital.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',   // change if needed
      port: 3306,
      username: 'root',    // your mysql user
      password: '', // your mysql password
      database: 'heathcare_db',
      entities: [User,Hospital],     // Entities you want to use
      synchronize: true,    // Auto create tables (disable in production)
    }),
    UsersModule,
    AuthModule,
    HospitalsModule
  ],
})
export class AppModule {}