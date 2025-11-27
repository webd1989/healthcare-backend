import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, UploadedFile, UseInterceptors,Query, NotFoundException,UploadedFiles  } from '@nestjs/common';;
import { FilesInterceptor } from '@nestjs/platform-express';

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

  
@Post('upload-images/:id')
@UseInterceptors(FilesInterceptor('images', 10))
async uploadFiles(
  @Param('id') id: number,
  @UploadedFiles() images: Express.Multer.File[],
) {
  const data = await this.appointmentsService.uploadImages(id, images);

  return {
    message: 'Files uploaded successfully',
    total: images.length,
    uploadedToAI: data,
    success: true
  };
}

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
@UseGuards(AuthGuard('jwt'))
@Post('dashboard')
async getDashboardData(
  @Query('doctor_id') doctorId?: string,
) {
  const cleanDoctorId = Number(doctorId);
  const data = await this.appointmentsService.getDashboardData(
    cleanDoctorId
  );

  return { records: data, success: true };
}

@UseGuards(AuthGuard('jwt'))
@Post("appointment-save-questions/:id")
async appointmentSaveQuestions(
  @Param('id') id: number,
  @Body() body: any,
) {  
  const data = await this.appointmentsService.update(id, body);
  return {
    success: true,
    message: "Data save successfully",
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

    let user:any = await this.appointmentsService.getPatientById(dto.user_id);
    const doctor = await this.appointmentsService.getUserById(dto.doctor_id);
  
    if (!doctor) {
      throw new NotFoundException('doctor not found');
    }
  
    if (!user) {

      const hashed = await bcrypt.hash('12345', 10);

      user = await this.appointmentsService.createPatient({
        first_name: dto.user_first_name,
        last_name: dto.user_last_name,
        mobile: dto.user_mobile,
        age: dto.user_age,
        country: dto.user_country,
        language: dto.user_language,
        recently_travelled: dto.recently_travelled,
        consent: dto.consent,
        gender: dto.user_gender,
        doctor_id: Number(dto.doctor_id),
        hospital_id: doctor.hospital_id,
        status: 1,
      });
    }
  
    dto.user_id = user.id;
    dto.user_name = user.first_name+' '+user.last_name;
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
@Post('get-list')
async getAPTAll(
  @Body('doctor_id') doctorId?: number,
) {
  const data = await this.appointmentsService.findAPTAll(Number(doctorId),);
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
  @Get('vitals/:id')
  async findVitals(@Param('id') id: number) {
    const data = await this.appointmentsService.findVitals(id);
    return {
      success: true,
      data,
    };
  }
 @UseGuards(AuthGuard('jwt'))
  @Get('transcribe-uploading-status/:id')
  async getTranscribeStatus(@Param('id') id: number) {
    const data = await this.appointmentsService.getTranscribeStatus(id);
    return {
      success: true,
      data,
    };
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('audio/files/:id')
  async getAudioFiles(@Param('id') id: number) {
    const data = await this.appointmentsService.getAudioFiles(id);
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
@Post('vitals/:id')
async updateVitals(
  @Param('id') id: number,
  @Body('vitals') appointment_vitals: string,   // expect only status field
) {
  const data = await this.appointmentsService.updateVitals(id, { appointment_vitals, previsit_created:"No" } as UpdateAppointmentDto);
  return {
    success: true,
    message: 'Appointment vitals saved successfully',
    data,
  };
}

@UseGuards(AuthGuard('jwt'))
@Delete(':id')
remove(@Param('id') id: number) {
    return this.appointmentsService.remove(id);
}


@UseGuards(AuthGuard('jwt'))
@Post('upload-transcribe/:id')
@UseInterceptors(FileInterceptor('file'))
async saveTranscribe(
  @Param('id') id: number,
  @UploadedFile() file: Express.Multer.File,   // expect only file field
) {  
  const data = await this.appointmentsService.saveTranscribe(id, file );
  return {
    success: true,
    message: 'Appointment transcribe saved successfully',
    data,
  };
}

 @UseGuards(AuthGuard('jwt'))
  @Get('get-transcribe-history/:id')
  async getTranscribeSummary(@Param('id') id: number) {
    const data = await this.appointmentsService.getTranscribeSummary(id);
    return {
      success: true,
      data,
    };
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('soap/notes/generate/:id')
  async generateSoapNotes(@Param('id') id: number) {
    const data = await this.appointmentsService.generateSoapNotes(id);
    return {
      success: true,
      data,
    };
  }

  
  @UseGuards(AuthGuard('jwt'))
  @Get('soap/notes/get/:id')
  async getSoapNotes(@Param('id') id: number) {
    const data = await this.appointmentsService.getSoapNotes(id);
    return {
      success: true,
      data,
    };
  }


@UseGuards(AuthGuard('jwt'))
@Get('get-images/:id')
async getImages(
  @Param('id') id: number
) {
  const data = await this.appointmentsService.getImages(id);
  return {
    success: true,
    message: 'Appointment images',
    data,
  };
}
}
