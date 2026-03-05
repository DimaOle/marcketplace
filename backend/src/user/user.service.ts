import { Injectable } from '@nestjs/common';
import { UserResponse, userSelect } from 'src/common/prisma-select';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreatUser } from './interfaces';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUserById(id: string) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async createUser(data: ICreatUser): Promise<UserResponse> {
    return this.prisma.user.create({
      data,
      select: userSelect,
    });
  }
}
