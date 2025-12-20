import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, NotFoundException, UseInterceptors,Query  } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';
import { log } from 'console';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

@UseGuards(AuthGuard('jwt'))
@Post()
async create(
  @Body() dto: CreateOrderDto
) {
  const plan = await this.ordersService.getPlanById(dto.plan_id);
  const user = await this.ordersService.getUserById(dto.user_id);

  if (!plan) {
    throw new NotFoundException('Plan not found');
  }

  if (!user) {
    throw new NotFoundException('User not found');
  }

  dto.user_name = user.name;
  dto.user_email = user.email;
  dto.monthly_price = dto.plan_type == "Monthly" ? plan.monthly_price:plan.monthly_price_for_year;
  dto.grand_total = ( dto.plan_type === 'Monthly' ? Number(plan.monthly_price) : Number(plan.monthly_price_for_year) * 12 ).toFixed(2);
  dto.templates = plan.templates;
  dto.ai_assisted = plan.ai_assisted;
  dto.medical_dictation = plan.medical_dictation;
  dto.plan = plan.name;

 const now = new Date();

  dto.start_time = now.toISOString();

  const end = new Date(now);
  if (dto.plan_type === 'Monthly') {
    end.setMonth(end.getMonth() + 1);
  } else if (dto.plan_type === 'Yearly') {
    end.setFullYear(end.getFullYear() + 1);
  }

  dto.end_time = end.toISOString();
  
  const order = await this.ordersService.create(dto);

  return {
    success: true,
    message: 'Order created successfully',
    data: dto.monthly_price,
  };
}

@UseGuards(AuthGuard('jwt'))
@Get('get-list')
async getAll() {
  const data = await this.ordersService.findAll();
  return { records: data, success:true };
}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('keywords') searchTitle?: string,
    @Body('doctor_id') doctorId?: number,
  ) {
    return this.ordersService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
      Number(doctorId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard/monthly-revenue')
  async getMonthlyRevenue() {
    const data = await this.ordersService.getMonthlyRevenue();
    return {
      success: true,
      data: data.total,
      percentageChange: data.percentageChange,
      changeText: data.changeText,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard/revenue-by-plan')
  async getRevenueByPlan() {
    const data = await this.ordersService.getRevenueByPlan();
    return {
      success: true,
      data: data.plans,
      totalMRR: data.totalMRR,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard/billing-metrics')
  async getBillingMetrics() {
    const data = await this.ordersService.getBillingMetrics();
    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard/subscription-breakdown')
  async getSubscriptionBreakdown() {
    const data = await this.ordersService.getSubscriptionBreakdown();
    return {
      success: true,
      data,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.ordersService.findOne(id);
    return {
      success: true,
      data,
    };
  }

}
