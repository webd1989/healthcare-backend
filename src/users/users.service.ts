import { Injectable, NotFoundException, BadRequestException   } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './update-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const userData:any = this.usersRepo.findOne({ where: { id } });
    return userData;
  }

  async updateProfile(userId: number, updateUser: UpdateUserDto): Promise<User> {    
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateUser);
    return this.usersRepo.save(user);
  }

   async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    // Compare current password
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Current password is incorrect');

    // Hash new password
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;

    await this.usersRepo.save(user);

    return { message: 'Password updated successfully',success: true };
  }

}