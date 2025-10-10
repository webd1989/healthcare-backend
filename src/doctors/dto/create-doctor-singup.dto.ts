import { IsNotEmpty, IsOptional, IsString, IsNumber,  } from 'class-validator';
import { Column} from 'typeorm';
import { Match } from 'src/validators/match.decorator'; // adjust path if needed


export class CreateDoctorDtoSignup {

  @IsOptional()
  @IsString()
  type: string;
    
  @IsOptional()
  @IsString()
  public_user_name: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  
  @IsNotEmpty()
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  confirm_password: string;

  @IsString()
  @IsNotEmpty()
  //@Column({ unique: true })
  email: string;

  @IsOptional()
  @IsNumber()
  status: number;

}