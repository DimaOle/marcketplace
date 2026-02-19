import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogInDTO, RegisterDTO } from './dto';
import * as bcrypt from 'bcrypt';
import {
  userAuthSelect,
  UserResponse,
  UserResponseWithAccesToken,
  userSelect,
} from 'src/common/prisma-select';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDTO): Promise<UserResponseWithAccesToken> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (user) {
      throw new UnauthorizedException('try another email');
    }

    const hashPassword = await bcrypt.hash(dto.password, 10);

    const createUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: userSelect,
    });
    const { id, email, role } = createUser;

    const token = await this.createJwtToken(id, email, role);
    return { ...createUser, ...token };
  }

  async logIn(dto: LogInDTO): Promise<UserResponseWithAccesToken> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
      select: userAuthSelect,
    });

    if (!user) {
      throw new UnauthorizedException('incorecty password or email');
    }

    const matchPasswords = await bcrypt.compare(dto.password, user.password);
    if (!matchPasswords) {
      throw new UnauthorizedException('incorecty password or email');
    }

    const jwt = await this.createJwtToken(user.id, user.email, user.role);
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, ...jwt };
  }

  private async createJwtToken(
    id: string,
    email: string,
    role: string,
  ): Promise<{ accessToken: string }> {
    const payload = { userId: id, email, role };
    return { accessToken: await this.jwt.signAsync(payload) };
  }
}
