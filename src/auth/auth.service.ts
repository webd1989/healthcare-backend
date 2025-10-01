import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  // async validateUser(email: string, pass: string): Promise<any> {
  //   const user = await this.usersRepo.findOne({ where: { email } });
  //   if (!user) throw new UnauthorizedException('User not found');

  //   const isMatch = await bcrypt.compare(pass, user.password);
  //   if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  //   return { id: user.id, email: user.email, name: user.name };
  // }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepo.findOne({
      where: { email },
      relations: ['role'],  // fetch role along with user
    });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role ? { id: user.role.id, name: user.role.name, permissions: user.role.permissions } : null,
    };
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role?.name };
    return {
      access_token: this.jwtService.sign(payload),
      details: user,
    };
  }
}