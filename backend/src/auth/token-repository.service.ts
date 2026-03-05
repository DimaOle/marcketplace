import { Injectable } from '@nestjs/common';
import {
  IDeleteTokensOptions,
  IFindTokensParms,
  ISavedRefreshTokenOption,
  ITokenParamsSelectOption,
  IUpdatedRefreshTokenOption,
  TokensType,
  TokenTypeUnique,
} from './interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenPrismaService {
  constructor(private prisma: PrismaService) {}

  async savedRefreshToken(data: ISavedRefreshTokenOption): Promise<boolean> {
    await this.prisma.token.create({ data });
    return true;
  }

  async updateRefreshTokenService(data: IUpdatedRefreshTokenOption) {
    await this.prisma.token.update({
      where: { id: data.sid },
      data: { refreshToken: data.refreshToken, id: data.newSid },
    });
    return true;
  }
  async findUniqueByParam(param: TokenTypeUnique, value: string) {
    const token = await this.prisma.token.findUnique({
      where: { [param]: value },
    });
    return token;
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

  async deleteManyIn(options: IDeleteTokensOptions) {
    const { param, value } = options;
    const count = await this.prisma.token.deleteMany({
      where: { [param]: { in: value } },
    });
    return count;
  }

  async deleteMany(param: TokensType, value: string): Promise<boolean> {
    const token = await this.prisma.token.deleteMany({
      where: { [param]: value },
    });
    return true;
  }
}
