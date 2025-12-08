import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { Templates } from './templates.entity';
import { Hospital } from '../hospitals/hospital.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Templates,Hospital,User])],
  providers: [TemplatesService],
  controllers: [TemplatesController],
})
export class TemplatesModule {}