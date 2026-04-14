import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type DataReqType = 'userId' | 'email' | 'role';

export const DataFromUser = createParamDecorator(
  (data: DataReqType | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) {
      return {};
    }
    return data ? req.user[data] : req.user;
  },
);
