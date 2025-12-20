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

  async paginate(page: number, limit: number, searchTitle?: string, doctorId?: number) {
      const query = this.orderRepo.createQueryBuilder('order');

      if (searchTitle) {
        query.where(
          'order.invoice_no LIKE :search OR order.user_name LIKE :search OR order.user_email LIKE :search',
          { search: `%${searchTitle}%` },
        );
      }

      // If doctorId > 0, add filter
      if (doctorId && doctorId > 0) {
        query.andWhere('order.user_id = :doctorId', { doctorId });
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

  async getMonthlyRevenue(): Promise<any> {
    try {
      // Get current date
      const now = new Date();
      
      // Calculate current month revenue (sum of grand_total)
      const currentMonthResult = await this.orderRepo
        .createQueryBuilder('order')
        .select('SUM(CAST(order.grand_total AS DECIMAL(10, 2)))', 'total')
        .where('YEAR(order.created_at) = :year', { year: now.getFullYear() })
        .andWhere('MONTH(order.created_at) = :month', { month: now.getMonth() + 1 })
        .getRawOne();
      
      const currentMonthRevenue = parseFloat(currentMonthResult?.total || '0');
      
      // Calculate last month revenue
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthResult = await this.orderRepo
        .createQueryBuilder('order')
        .select('SUM(CAST(order.grand_total AS DECIMAL(10, 2)))', 'total')
        .where('YEAR(order.created_at) = :year', { year: lastMonth.getFullYear() })
        .andWhere('MONTH(order.created_at) = :month', { month: lastMonth.getMonth() + 1 })
        .getRawOne();
      
      const lastMonthRevenue = parseFloat(lastMonthResult?.total || '0');
      
      // Calculate percentage change
      let percentageChange = 0;
      let changeText = '0% vs last month';
      
      if (lastMonthRevenue > 0) {
        percentageChange = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        const sign = percentageChange >= 0 ? '+' : '';
        changeText = `${sign}${percentageChange.toFixed(1)}% vs last month`;
      } else if (currentMonthRevenue > 0) {
        changeText = '+100% vs last month';
        percentageChange = 100;
      }
      
      console.log('Current month revenue:', currentMonthRevenue);
      console.log('Last month revenue:', lastMonthRevenue);
      console.log('Percentage change:', percentageChange);
      console.log('Change text:', changeText);
      
      return {
        total: currentMonthRevenue,
        lastMonthTotal: lastMonthRevenue,
        percentageChange: percentageChange,
        changeText: changeText,
      };
    } catch (error) {
      console.error('Error calculating monthly revenue:', error);
      throw error;
    }
  }

  async getRevenueByPlan(): Promise<any> {
    try {
      // Get current date
      const now = new Date();
      
      // Get all plans with status = 1
      const allPlans = await this.planRepo.find({
        where: { status: 1 },
        order: { id: 'ASC' },
      });
      
      // Get revenue breakdown by plan_id for current month
      const revenueByPlanId = await this.orderRepo
        .createQueryBuilder('order')
        .select('order.plan_id', 'plan_id')
        .addSelect('SUM(CAST(order.grand_total AS DECIMAL(10, 2)))', 'revenue')
        .where('YEAR(order.created_at) = :year', { year: now.getFullYear() })
        .andWhere('MONTH(order.created_at) = :month', { month: now.getMonth() + 1 })
        .groupBy('order.plan_id')
        .getRawMany();
      
      // Create a map of plan_id to revenue
      const revenueMap = new Map<number, number>();
      revenueByPlanId.forEach((item: any) => {
        revenueMap.set(item.plan_id, parseFloat(item.revenue || '0'));
      });
      
      // Calculate total MRR and build plan breakdown
      let totalMRR = 0;
      const planBreakdown: any[] = [];
      
      allPlans.forEach((plan) => {
        const revenue = revenueMap.get(plan.id) || 0;
        totalMRR += revenue;
        planBreakdown.push({
          plan: plan.name,
          plan_id: plan.id,
          revenue: revenue,
        });
      });
      
      // Calculate percentages and format data
      const formattedPlans = planBreakdown.map((item) => {
        const percentage = totalMRR > 0 ? (item.revenue / totalMRR) * 100 : 0;
        return {
          plan: item.plan,
          plan_id: item.plan_id,
          revenue: item.revenue,
          percentage: percentage,
          percentageText: totalMRR > 0 ? `${percentage.toFixed(1)}% of total` : '0% of total',
        };
      });
      
      // Sort by revenue descending, then by plan name
      formattedPlans.sort((a, b) => {
        if (b.revenue !== a.revenue) {
          return b.revenue - a.revenue;
        }
        return a.plan.localeCompare(b.plan);
      });
      
      console.log('Revenue by plan:', formattedPlans);
      console.log('Total MRR:', totalMRR);
      
      return {
        plans: formattedPlans,
        totalMRR: totalMRR,
      };
    } catch (error) {
      console.error('Error calculating revenue by plan:', error);
      throw error;
    }
  }

  async getBillingMetrics(): Promise<any> {
    try {
      const now = new Date();
      
      // Get current month MRR (same as monthly revenue)
      const currentMonthResult = await this.orderRepo
        .createQueryBuilder('order')
        .select('SUM(CAST(order.grand_total AS DECIMAL(10, 2)))', 'total')
        .where('YEAR(order.created_at) = :year', { year: now.getFullYear() })
        .andWhere('MONTH(order.created_at) = :month', { month: now.getMonth() + 1 })
        .getRawOne();
      
      const mrr = parseFloat(currentMonthResult?.total || '0');
      
      // Get last month MRR for percentage calculation
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthResult = await this.orderRepo
        .createQueryBuilder('order')
        .select('SUM(CAST(order.grand_total AS DECIMAL(10, 2)))', 'total')
        .where('YEAR(order.created_at) = :year', { year: lastMonth.getFullYear() })
        .andWhere('MONTH(order.created_at) = :month', { month: lastMonth.getMonth() + 1 })
        .getRawOne();
      
      const lastMonthMRR = parseFloat(lastMonthResult?.total || '0');
      
      // Calculate percentage change
      let percentageChange = 0;
      let changeText = '0% vs last month';
      if (lastMonthMRR > 0) {
        percentageChange = ((mrr - lastMonthMRR) / lastMonthMRR) * 100;
        const sign = percentageChange >= 0 ? '+' : '';
        changeText = `${sign}${percentageChange.toFixed(1)}% vs last month`;
      } else if (mrr > 0) {
        changeText = '+100% vs last month';
        percentageChange = 100;
      }
      
      // Collected this month (all orders created this month - assuming all are collected for now)
      // TODO: Update when payment status field is added
      const collected = mrr;
      const collectedPercentage = mrr > 0 ? ((collected / mrr) * 100).toFixed(0) : '0';
      
      // Pending payments (orders created this month but not yet paid)
      // TODO: Update when payment status field is added - for now return 0
      const pendingResult = await this.orderRepo
        .createQueryBuilder('order')
        .select('COUNT(order.id)', 'count')
        .addSelect('SUM(CAST(order.grand_total AS DECIMAL(10, 2)))', 'total')
        .where('YEAR(order.created_at) = :year', { year: now.getFullYear() })
        .andWhere('MONTH(order.created_at) = :month', { month: now.getMonth() + 1 })
        .getRawOne();
      
      // For now, pending = 0 (can be updated when payment status is available)
      const pendingAmount = 0;
      const pendingCount = 0;
      
      // Overdue amount (orders past end_time)
      // TODO: Update when payment status field is added
      const overdueResult = await this.orderRepo
        .createQueryBuilder('order')
        .select('COUNT(order.id)', 'count')
        .addSelect('SUM(CAST(order.grand_total AS DECIMAL(10, 2)))', 'total')
        .where('order.end_time < :now', { now: now })
        .getRawOne();
      
      const overdueAmount = parseFloat(overdueResult?.total || '0');
      const overdueCount = parseInt(overdueResult?.count || '0');
      
      return {
        mrr: mrr,
        mrrChange: changeText,
        collected: collected,
        collectedPercentage: collectedPercentage,
        pending: pendingAmount,
        pendingCount: pendingCount,
        overdue: overdueAmount,
        overdueCount: overdueCount,
      };
    } catch (error) {
      console.error('Error calculating billing metrics:', error);
      throw error;
    }
  }

  async getSubscriptionBreakdown(): Promise<any> {
    try {
      // Get all plans with status = 1
      const allPlans = await this.planRepo.find({
        where: { status: 1 },
        order: { id: 'ASC' },
      });
      
      // Get active subscriptions (users with plan_id)
      const activeUsers = await this.userRepo.find({
        where: { status: 1 },
        select: ['id', 'plan_id', 'hospital_id'],
      });
      
      // Count organizations by plan
      const planCounts = new Map<number, { count: number; revenue: number }>();
      
      // Initialize all plans with 0
      allPlans.forEach((plan) => {
        planCounts.set(plan.id, { count: 0, revenue: 0 });
      });
      
      // Count users by plan_id
      activeUsers.forEach((user) => {
        if (user.plan_id) {
          const current = planCounts.get(user.plan_id) || { count: 0, revenue: 0 };
          current.count++;
          planCounts.set(user.plan_id, current);
        }
      });
      
      // Get revenue by plan for current month
      const now = new Date();
      const revenueByPlanId = await this.orderRepo
        .createQueryBuilder('order')
        .select('order.plan_id', 'plan_id')
        .addSelect('SUM(CAST(order.monthly_price AS DECIMAL(10, 2)))', 'revenue')
        .where('YEAR(order.created_at) = :year', { year: now.getFullYear() })
        .andWhere('MONTH(order.created_at) = :month', { month: now.getMonth() + 1 })
        .andWhere('order.plan_type = :planType', { planType: 'Monthly' })
        .groupBy('order.plan_id')
        .getRawMany();
      
      // Update revenue for each plan
      revenueByPlanId.forEach((item: any) => {
        const current = planCounts.get(item.plan_id) || { count: 0, revenue: 0 };
        current.revenue = parseFloat(item.revenue || '0');
        planCounts.set(item.plan_id, current);
      });
      
      // Build breakdown array
      const breakdown: any[] = [];
      let totalOrganizations = 0;
      
      allPlans.forEach((plan) => {
        const data = planCounts.get(plan.id) || { count: 0, revenue: 0 };
        totalOrganizations += data.count;
        breakdown.push({
          plan: plan.name,
          plan_id: plan.id,
          organizations: data.count,
          revenue: data.revenue,
        });
      });
      
      // Add Trial plan (users with no plan_id or plan_id = 0)
      const trialUsers = activeUsers.filter((user) => !user.plan_id || user.plan_id === 0);
      breakdown.push({
        plan: 'Trial',
        plan_id: 0,
        organizations: trialUsers.length,
        revenue: 0,
      });
      totalOrganizations += trialUsers.length;
      
      return {
        breakdown: breakdown,
        totalOrganizations: totalOrganizations,
      };
    } catch (error) {
      console.error('Error calculating subscription breakdown:', error);
      throw error;
    }
  }
}