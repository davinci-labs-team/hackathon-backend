import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { SupabaseDecodedUser } from "./supabase-decoded-user.types";

interface CustomRequest extends Request {
  user: SupabaseDecodedUser;
}

export const SupabaseUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SupabaseDecodedUser => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();
    const user = request.user;
    return user;
  }
);
