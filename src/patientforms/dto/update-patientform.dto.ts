import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientformDto } from './create-patientform.dto';

export class UpdatePatientformDto extends PartialType(CreatePatientformDto) {}