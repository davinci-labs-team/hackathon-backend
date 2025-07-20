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

export function ApiGetAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: "Get all users" }),
    ApiResponse({
      status: 200,
      description: "List of all users",
      type: UserResponse,
      isArray: true,
    })
  );
}

export function ApiGetUserById() {
  return applyDecorators(
    ApiOperation({ summary: "Get a user by ID" }),
    ApiResponse({
      status: 200,
      description: "User found",
      type: UserResponse,
    }),
    ApiResponse({
      status: 403,
      description: "You can only access your own user",
    }),
    ApiResponse({
      status: 404,
      description: "User not found",
    })
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: "Update a user by ID" }),
    ApiResponse({
      status: 200,
      description: "User updated successfully",
      type: UserResponse,
    }),
    ApiResponse({
      status: 403,
      description: "You can only update your own user",
    }),
    ApiResponse({
      status: 404,
      description: "User not found",
    })
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: "Delete a user by ID" }),
    ApiResponse({
      status: 200,
      description: "User deleted successfully",
    }),
    ApiResponse({
      status: 403,
      description: "You can only delete your own user",
    }),
    ApiResponse({
      status: 404,
      description: "User not found",
    })
  );
}
