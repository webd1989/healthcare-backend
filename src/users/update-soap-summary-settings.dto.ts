import { IsOptional } from 'class-validator';

export class UpdateSoapSummarySettingsDto {
  @IsOptional()
  soapSummaryOrder?: string[];

  @IsOptional()
  preVisitConfig?: any;

  // Optional extra configuration keys (if provided, store and also forward to ClinicAI)
  @IsOptional()
  categories?: string[];

  @IsOptional()
  max_questions?: number;

  @IsOptional()
  global_categories?: string[];

  @IsOptional()
  pre_visit_ai_config?: any;

  @IsOptional()
  soap_ai_config?: any;
}


