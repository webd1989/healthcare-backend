import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNumberString, Matches, IsInt, Min } from 'class-validator';

export class CreateSupportTicketDto {

  @IsNumber()
  @IsNotEmpty({ message: 'Invalid user' })
  user_id: number;

  @IsOptional()
  @IsString()
  user_name: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject cannot be empty' })
  subject?: string;

  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty' })
  message: string;
  
  @IsOptional()
  @IsNumber()
  ticket_no: string;

  @IsOptional()
  @IsNumber()
  attachment: string;

  @IsOptional()
  @IsNumber()
  status: number;

}