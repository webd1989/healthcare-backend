import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query, NotFoundException  } from '@nestjs/common';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
 import { diskStorage } from 'multer';
import { extname } from 'path';
import * as bcrypt from 'bcrypt';


@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

@Post('/save-form/:id')
async updateFiledData(
  @Param('id') id: number,
  @Body() dto: UpdateAppointmentDto,
) {
  const data = await this.appointmentsService.update(id, dto);
  return {
    success: true,
    message: 'Appointment updated successfully',
    data,
  };
}

@Get('/get/:id')
async findOneData(@Param('id') id: number) {
  const data = await this.appointmentsService.findOne(id);
  return {
    success: true,
    data,
  };
}

  @UseGuards(AuthGuard('jwt'))
@Post()
async create(
  @Body() dto: CreateAppointmentDto,
) {

    let user:any = await this.appointmentsService.getUserById(dto.user_id);
    const doctor = await this.appointmentsService.getUserById(dto.doctor_id);
  
    if (!doctor) {
      throw new NotFoundException('doctor not found');
    }
  
    if (!user) {
      // Step 2️⃣: Generate user_code (e.g., DTR-0001)
      const userCode = dto.user_name
        .toLowerCase()                // lowercase
        .trim()                       // remove spaces at ends
        .replace(/\s+/g, '-')         // replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') + // remove invalid characters
      `-${dto.user_mobile}`;

      const hashed = await bcrypt.hash('12345', 10);

      user = await this.appointmentsService.createPatient({
        name: dto.user_name,
        mobile: dto.user_mobile,
        doctor_id: Number(dto.doctor_id),
        user_code: userCode,
        hospital_id: doctor.hospital_id,
        status: 1,
        type: 'Patient',
        password: hashed,
      });
    }
  
    dto.user_name = user.name;
    dto.user_email = user.email;

    dto.doctor_name = doctor.name;
    dto.doctor_email = doctor.email;

  const appointment = await this.appointmentsService.create(dto);


  return {
    success: true,
    message: 'Appointment created successfully',
    data: appointment,
  };
}

@UseGuards(AuthGuard('jwt'))
@Get('get-list')
async getAll() {
  const data = await this.appointmentsService.findAll();
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
    return this.appointmentsService.paginate(
      Number(page),
      Number(limit),
      searchTitle,
      Number(doctorId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.appointmentsService.findOne(id);
    return {
      success: true,
      data,
    };
  }

@UseGuards(AuthGuard('jwt'))
@Post(':id')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/appointments',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }),
)
async update(
  @Param('id') id: number,
  @Body() dto: UpdateAppointmentDto,
) {
  const data = await this.appointmentsService.update(id, dto);
  return {
    success: true,
    message: 'Appointment updated successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Put('update-status/:id')
async updateStatus(
  @Param('id') id: number,
  @Body('status') status: number,   // expect only status field
) {
  const data = await this.appointmentsService.update(id, { status } as UpdateAppointmentDto);
  return {
    success: true,
    message: 'Appointment status updated successfully',
    data,
  };
}
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.appointmentsService.remove(id);
  }


}
