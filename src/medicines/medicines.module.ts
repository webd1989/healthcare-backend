import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { Medicines } from './medicines.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medicines])],
  providers: [MedicinesService],
  controllers: [MedicinesController],
})
export class MedicinesModule {}