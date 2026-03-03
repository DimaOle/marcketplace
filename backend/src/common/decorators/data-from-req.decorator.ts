import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type DataReqType = 'userId' | 'email' | 'role';

export const DataFromUser = createParamDecorator(
  (data: DataReqType | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    console.log(req.user);
    if (!req.user) {
      return {};
    }
    return data ? req.user[data] : req.user;
  },
);
