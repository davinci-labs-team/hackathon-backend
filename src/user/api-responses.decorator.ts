import { applyDecorators } from "@nestjs/common";
import { ApiResponse, ApiOperation } from "@nestjs/swagger";
import { UserResponse } from "./dto/user-response";

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: "Create a new user" }),
    ApiResponse({
      status: 201,
      description: "The user has been successfully created",
      type: UserResponse,
    }),
    ApiResponse({
      status: 409,
      description:
        "User with this email already exists, or user with this supabase token already exists",
    })
  );
}
