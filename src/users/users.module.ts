// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // only if you are using TypeORM
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [
    // Register entity here if using TypeORM
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // optional if used elsewhere
})
export class UsersModule {}

