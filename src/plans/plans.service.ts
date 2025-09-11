import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plans } from './plans.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plans)
    private planRepo: Repository<Plans>,
  ) {}

  async create(dto: CreatePlanDto): Promise<any> {
    const plan = this.planRepo.create(dto);
    const saved = await this.planRepo.save(plan);
    
     return {
      success: true,
      message: 'Plan created successfully',
      data: saved,
    };
  }

  async findAll(): Promise<Plans[]> {
    return this.planRepo.find();
  }

  async paginate(page: number, limit: number, searchTitle?: string) {
      const query = this.planRepo.createQueryBuilder('plan');

      if (searchTitle) {
        query.where(
          'plan.name LIKE :search',
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

  async findOne(id: number): Promise<Plans> {
    const plan = await this.planRepo.findOne({ where: { id } });
    if (!plan) throw new NotFoundException(`Plan ${id} not found`);
    return plan;
  }

  async update(id: number, dto: UpdatePlanDto): Promise<any> {
    const plan = await this.findOne(id);
    Object.assign(plan, dto);
    return this.planRepo.save(plan);
  }

  async remove(id: number): Promise<any> {
    const plan = await this.findOne(id);
    await this.planRepo.remove(plan);
     return {
      success: true,
      message: 'Plan deleted successfully',
    };
  }
}