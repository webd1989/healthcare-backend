import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

import { ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ValidateIf((o) => !o.name)
    invalid: never; // will trigger validation if all fields are missing
}