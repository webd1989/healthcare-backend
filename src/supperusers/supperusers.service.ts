import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateSupperUsersDto } from './dto/create-supperuser.dto';
import { UpdateSupperUsersDto } from './dto/update-supperuser.dto';


@Injectable()
export class SuperUsersService {
  constructor(
    @InjectRepository(User)
    private supperUsersRepo: Repository<User>,
  ) {}

  async create(dto: CreateSupperUsersDto): Promise<any> {
    const supperuser = this.supperUsersRepo.create(dto);
    const saved = await this.supperUsersRepo.save(supperuser);
    
     return {
      success: true,
      message: 'User created successfully',
      data: saved,
    };
  }

  async findAll(role_id: number): Promise<User[]> {
    return this.supperUsersRepo.find({
      where: {
        role_id: role_id,
        type: 'user',
      },
    });
  }

  async paginate(page: number, limit: number, searchTitle?: string) {
      const query = this.supperUsersRepo.createQueryBuilder('user');

      // Always filter by type = Doctor
      query.where('type = :type', { type: 'User' });

      if (searchTitle) {
        query.where(
          'name LIKE :search OR email LIKE :search',
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

  async findOne(id: number): Promise<User> {
    const supperuser = await this.supperUsersRepo.findOne({ where: { id } });
    if (!supperuser) throw new NotFoundException(`User ${id} not found`);
  
    return supperuser;
  }

  async update(id: number, dto: UpdateSupperUsersDto): Promise<any> {
    const supperuser = await this.findOne(id);
    Object.assign(supperuser, dto);
    return this.supperUsersRepo.save(supperuser);
  }

  async remove(id: number): Promise<any> {
    const supperuser = await this.findOne(id);
    await this.supperUsersRepo.remove(supperuser);
     return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}