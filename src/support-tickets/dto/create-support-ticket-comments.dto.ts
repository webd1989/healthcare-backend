import { IsNotEmpty, IsOptional, IsString, IsNumber, IsNumberString, Matches, IsInt, Min } from 'class-validator';

export class CreateSupportTicketCommentsDto {

    @IsNumber()
    @IsNotEmpty({ message: 'Invalid request' })
    ticket_id?: number;

    @IsNumber()
    @IsNotEmpty({ message: 'Invalid user' })
    user_id: number;

    @IsOptional()
    @IsString()
    user_name: string;

    @IsString()
    @IsNotEmpty({ message: 'Message cannot be empty' })
    message: string;

    @IsOptional()
    @IsNumber()
    attachment: string;
    
    @IsOptional()
    @IsNumber()
    status: number;

}