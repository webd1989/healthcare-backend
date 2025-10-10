import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from './orders.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Plans } from 'src/plans/plans.entity';
import { User } from 'src/auth/user.entity';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private orderRepo: Repository<Orders>,

    @InjectRepository(Plans)
    private readonly planRepo: Repository<Plans>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getPlanById(plan_id: number): Promise<Plans | null> {
    return this.planRepo.findOne({ where: { id: plan_id } });
  }

  async getUserById(user_id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: user_id } });
  }

  async create(dto: CreateOrderDto): Promise<any> {
    const order = this.orderRepo.create(dto);
    const saved = await this.orderRepo.save(order);

    // Step 2️⃣: Generate user_code (e.g., DTR-0001)
    const invoiceNo = `ORD-${String(saved.id).padStart(6, '0')}`;

    // Step 3️⃣: Update the same row
    await this.orderRepo.update(saved.id, { invoice_no: invoiceNo });

    // Step 3️⃣: Update the same row
    await this.userRepo.update(dto.user_id, { plan_id: dto.plan_id });
    
     return {
      success: true,
      message: 'Order created successfully',
      data: saved,
    };
  }

  async findAll(): Promise<Orders[]> {
    return this.orderRepo.find();
  }

  async paginate(page: number, limit: number, searchTitle?: string) {
      const query = this.orderRepo.createQueryBuilder('order');

      if (searchTitle) {
        query.where(
          'order.name LIKE :search',
          { search: `%${searchTitle}%` },
        );
      }

      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        success: true,
        data,
        total,
        page,
        limit,
      };
  }

  async findOne(id: number): Promise<Orders> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async update(id: number, dto: UpdateOrderDto): Promise<any> {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.orderRepo.save(order);
  }

  async remove(id: number): Promise<any> {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
     return {
      success: true,
      message: 'Order deleted successfully',
    };
  }
}