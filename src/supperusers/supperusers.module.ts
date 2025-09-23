import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperUsersService } from './supperusers.service';
import { SuperUsersController } from './supperusers.controller';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SuperUsersService],
  controllers: [SuperUsersController],
})
export class SuperUsersModule {}