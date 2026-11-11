import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const UserContext = createParamDecorator<string>(
  (data: unknown, ctx: ExecutionContext) => {
    const id = ctx.switchToHttp().getRequest().userId;
    if (!id) throw new InternalServerErrorException('Something went wrong');
    return id;
  },
);
