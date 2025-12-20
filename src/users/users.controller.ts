import { Controller, Get, Put, Body, Req, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { User } from 'src/auth/user.entity';
import { UpdateUserDto } from './update-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { UpdateSoapSummarySettingsDto } from './update-soap-summary-settings.dto';
import { AuthGuard } from '@nestjs/passport'; // If using JWT strategy

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  // get user profile data
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@GetUser() user: any) {
    const profile = await this.usersService.findById(user.userId);
    return { success:true, message: 'Profile fetched successfully', profile };
  }

 // update user profile
  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    const updatedUser = await this.usersService.updateProfile(userId, updateUserDto);

    return {
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    };
  }

  // update SOAP Summary Settings (stored as single JSON string column on users table)
  @UseGuards(JwtAuthGuard)
  @Put('update-soap-summary-settings')
  async updateSoapSummarySettings(
    @Req() req,
    @Body() dto: UpdateSoapSummarySettingsDto,
  ) {
    const userId = req.user.userId;
    const updatedUser = await this.usersService.updateSoapSummarySettings(userId, dto);

    return {
      success: true,
      message: 'SOAP summary settings updated successfully',
      data: updatedUser,
    };
  }

// change password
  @UseGuards(AuthGuard('jwt'))
  @Post('update-password')
  async updatePassword(@Body() dto: UpdatePasswordDto, @Req() req) {
    const userId = req.user.id; // user extracted from JWT payload
    return this.usersService.updatePassword(userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dashboard/active-users')
  async getActiveUsers() {
    const data = await this.usersService.getActiveUsersCount();
    return {
      success: true,
      data: data.total,
      monthlyChange: data.monthlyChange,
      changeText: data.changeText,
    };
  }

}