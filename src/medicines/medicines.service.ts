import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicines } from './medicines.entity';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(
    @InjectRepository(Medicines)
    private medicineRepo: Repository<Medicines>,
  ) {}

  async create(dto: CreateMedicineDto): Promise<any> {
    const medicine = this.medicineRepo.create(dto);
    const saved = await this.medicineRepo.save(medicine);
    
     return {
      success: true,
      message: 'Medicine created successfully',
      data: saved,
    };
  }

  async findAll(): Promise<Medicines[]> {
    return this.medicineRepo.find();
  }

  async paginate(page: number, limit: number, searchTitle?: string) {
      const query = this.medicineRepo.createQueryBuilder('medicine');

      if (searchTitle) {
        query.where(
          'medicine.name LIKE :search',
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

  async findOne(id: number): Promise<Medicines> {
    const medicine = await this.medicineRepo.findOne({ where: { id } });
    if (!medicine) throw new NotFoundException(`Medicine ${id} not found`);
    return medicine;
  }

  async update(id: number, dto: UpdateMedicineDto): Promise<any> {
    const medicine = await this.findOne(id);
    Object.assign(medicine, dto);
    return this.medicineRepo.save(medicine);
  }

  async remove(id: number): Promise<any> {
    const medicine = await this.findOne(id);
    await this.medicineRepo.remove(medicine);
     return {
      success: true,
      message: 'Medicine deleted successfully',
    };
  }
}