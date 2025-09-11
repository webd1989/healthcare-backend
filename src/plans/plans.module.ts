import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plans } from './plans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plans])],
  providers: [PlansService],
  controllers: [PlansController],
})
export class PlansModule {}