import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessTokenPayloadInterface } from '../auth/interfaces/access-token-payload.interface';

export const CurrentUser = createParamDecorator<
  any,
  any,
  AccessTokenPayloadInterface
>((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
