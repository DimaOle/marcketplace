import { Injectable } from '@nestjs/common';
import {
  IFindTokensParms,
  ISaveOption,
  ITokenParamsSelectOption,
  IUpdateOption,
} from '../interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenStorage } from '../base';

@Injectable()
export class TokenPrismaService extends TokenStorage {
  constructor(private prisma: PrismaService) {
    super();
  }

  async save(data: ISaveOption): Promise<void> {
    await this.prisma.token.create({ data });
  }

  async update(data: IUpdateOption): Promise<void> {
    const { sid, refreshToken, newSid } = data;
    await this.prisma.token.update({
      where: { id: sid },
      data: { refreshToken, id: newSid },
    });
  }

  async findUnique(sid: string) {
    const token = await this.prisma.token.findUnique({ where: { id: sid } });
    return token;
  }

  async deleteOldSessions(userId: string, limit?: number) {
    const sessions = await this.prisma.token.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: limit ?? 5,
      select: { id: true },
    });

    if (sessions.length > 0) {
      await this.prisma.token.deleteMany({
        where: { id: { in: sessions.map((s) => s.id) } },
      });
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.token.deleteMany({ where: { userId } });
  }

  async deleteAllById(arrId: string[]): Promise<void> {
    await this.prisma.token.deleteMany({ where: { id: { in: arrId } } });
  }

  async findManyByParams(
    params: IFindTokensParms,
    selectOption?: ITokenParamsSelectOption,
    limit = 5,
  ) {
    const tokens = await this.prisma.token.findMany({
      skip: limit,
      where: params,
      orderBy: { createdAt: 'desc' },
      select: selectOption,
    });

    return tokens;
  }
}
