import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Orders } from './orders.entity';
import { Plans } from '../plans/plans.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, Plans, User])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}