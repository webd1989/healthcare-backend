import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto): Promise<any> {
    const role = this.roleRepo.create(dto);
    const saved = await this.roleRepo.save(role);
    
     return {
      success: true,
      message: 'Role created successfully',
      data: saved,
    };
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  async paginate(page: number, limit: number, searchTitle?: string) {
      const query = this.roleRepo.createQueryBuilder('role');

      if (searchTitle) {
        query.where(
          'role.name LIKE :search OR role.address LIKE :search',
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

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    
    return role;
  }

  async update(id: number, dto: UpdateRoleDto): Promise<any> {
    const role = await this.findOne(id);
    Object.assign(role, dto);
    return this.roleRepo.save(role);
  }

  async remove(id: number): Promise<any> {
    const role = await this.findOne(id);
    await this.roleRepo.remove(role);
     return {
      success: true,
      message: 'Role deleted successfully',
    };
  }
}