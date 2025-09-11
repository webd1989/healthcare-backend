import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Countries } from './countries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  providers: [CountriesService],
  controllers: [CountriesController],
})
export class CountriesModule {}