import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [StaffsService],
  controllers: [StaffsController],
})
export class StaffsModule {}