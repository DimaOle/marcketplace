import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/generated/prisma/enums';

export const KEY_ROLE = 'role';

export const Roles = ([...roles]: Role[]) => SetMetadata(KEY_ROLE, roles);
