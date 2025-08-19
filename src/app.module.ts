import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',   // change if needed
      port: 3306,
      username: 'root',    // your mysql user
      password: '', // your mysql password
      database: 'heathcare_db',
      entities: [User],     // Entities you want to use
      synchronize: true,    // Auto create tables (disable in production)
    }),
    AuthModule,
  ],
})
export class AppModule {}