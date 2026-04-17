// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import type { Request } from 'express';
// import type { JwtPayload } from '../types/jwt-payload.type';

// export const CurrentUser = createParamDecorator(
//   (_data: unknown, ctx: ExecutionContext): JwtPayload => {
//     const request = ctx
//       .switchToHttp()
//       .getRequest<Request & { user?: JwtPayload }>();
//     return request.user as JwtPayload;
//   },
// );

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../types/jwt-payload.type';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    return request.user!;
  },
);
