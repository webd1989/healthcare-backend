import { IsString, IsArray, IsOptional } from 'class-validator';

export class FormField {
  @IsString()
  type: string;

  @IsString()
  label: string;

  @IsArray()
  @IsOptional()
  options: any[];
}