import { PartialType } from '@nestjs/mapped-types';
import { CreateSupperUsersDto } from './create-supperuser.dto';

export class UpdateSupperUsersDto extends PartialType(CreateSupperUsersDto) {}