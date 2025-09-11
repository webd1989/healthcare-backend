import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimezonesService } from './timezones.service';
import { TimezonesController } from './timezones.controller';
import { Timezones } from './timezones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Timezones])],
  providers: [TimezonesService],
  controllers: [TimezonesController],
})
export class TimezonesModule {}