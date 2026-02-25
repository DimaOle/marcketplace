import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export type CookieFromReqType = 'refreshToken';
export const CookieFromReq = createParamDecorator(
  (data: CookieFromReqType | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.cookies) {
      return {};
    }
    console.log(req.cookies);
    return data ? req.cookies[data] : req.cookies;
  },
);
