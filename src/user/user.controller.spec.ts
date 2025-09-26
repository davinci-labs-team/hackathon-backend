import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { SupabaseDecodedUser } from "../common/decorators/supabase-decoded-user.types";
import { Role } from "@prisma/client";

describe("UserController", () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    login: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockSupabaseUser: SupabaseDecodedUser = {
    sub: "cc31ac03-58ef-4821-a445-61f289882e36",
    email: "testutilisateur2@gmail.com",
    phone: "+33123456789",
    role: "authenticated",
    session_id: "da36fd86-ac00-4b95-9c50-2ae9ec4f93d5",
    is_anonymous: false,
  };

  const mockCreateUserDto: CreateUserDto = {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    role: Role.PARTICIPANT,
    school: "Harvard University",
  };

  const mockUpdateUserDto: UpdateUserDto = {
    firstname: "Jane",
  };

  const mockUserId = "cc31ac03-58ef-4821-a445-61f289882e36";

  const mockCreatedUser = {
    id: mockUserId,
    name: "John Doe",
    supabaseId: mockSupabaseUser.sub,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUpdatedUser = {
    ...mockCreatedUser,
    name: "Jane Doe",
    updatedAt: new Date(),
  };

  const mockAllUsers = [
    mockCreatedUser,
    {
      id: "bb21ac03-58ef-4821-a445-61f289882e37",
      name: "Jane Smith",
      supabaseId: "bb21ac03-58ef-4821-a445-61f289882e37",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      mockUserService.create.mockResolvedValue(mockCreatedUser);

      const result = await controller.create(mockCreateUserDto, mockSupabaseUser);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserService.create).toHaveBeenCalledWith(mockCreateUserDto, mockSupabaseUser.sub);
    });

    it("should handle service errors during user creation", async () => {
      const error = new Error("Creation failed");
      mockUserService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateUserDto, mockSupabaseUser)).rejects.toThrow(
        "Creation failed"
      );

      expect(mockUserService.create).toHaveBeenCalledWith(mockCreateUserDto, mockSupabaseUser.sub);
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const loginResult = {
        user: mockCreatedUser,
        message: "Login successful",
        token: "mock-jwt-token",
      };
      mockUserService.login.mockResolvedValue(loginResult);

      const result = await controller.login(mockSupabaseUser);

      expect(result).toEqual(loginResult);
      expect(mockUserService.login).toHaveBeenCalledWith(mockSupabaseUser.sub);
    });

    it("should handle login errors", async () => {
      const error = new Error("Login failed");
      mockUserService.login.mockRejectedValue(error);

      await expect(controller.login(mockSupabaseUser)).rejects.toThrow("Login failed");

      expect(mockUserService.login).toHaveBeenCalledWith(mockSupabaseUser.sub);
    });
  });

  describe("findAll", () => {
    it("should return all users", async () => {
      mockUserService.findAll.mockResolvedValue(mockAllUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockAllUsers);
      expect(mockUserService.findAll).toHaveBeenCalledWith();
    });

    it("should handle errors when fetching all users", async () => {
      const error = new Error("Failed to fetch users");
      mockUserService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow("Failed to fetch users");
      expect(mockUserService.findAll).toHaveBeenCalledWith();
    });
  });

  describe("protected", () => {
    it("should return supabase user data", () => {
      const result = controller.protected(mockSupabaseUser);

      expect(result).toEqual(mockSupabaseUser);
    });
  });

  describe("findOne", () => {
    it("should return a single user", async () => {
      mockUserService.findOne.mockResolvedValue(mockCreatedUser);

      const result = await controller.findOne(mockUserId);

      expect(result).toEqual(mockCreatedUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith(mockUserId);
    });

    it("should handle user not found", async () => {
      const error = new Error("User not found");
      mockUserService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(mockUserId)).rejects.toThrow("User not found");

      expect(mockUserService.findOne).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      mockUserService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update(mockUserId, mockUpdateUserDto, mockSupabaseUser);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockUserService.update).toHaveBeenCalledWith(
        mockUserId,
        mockUpdateUserDto,
        mockSupabaseUser.sub
      );
    });

    it("should handle update errors", async () => {
      const error = new Error("Update failed");
      mockUserService.update.mockRejectedValue(error);

      await expect(
        controller.update(mockUserId, mockUpdateUserDto, mockSupabaseUser)
      ).rejects.toThrow("Update failed");

      expect(mockUserService.update).toHaveBeenCalledWith(
        mockUserId,
        mockUpdateUserDto,
        mockSupabaseUser.sub
      );
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      const deleteResult = {
        message: "User deleted successfully",
        deletedUserId: mockUserId,
      };
      mockUserService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(mockUserId, mockSupabaseUser);

      expect(result).toEqual(deleteResult);
      expect(mockUserService.remove).toHaveBeenCalledWith(mockUserId, mockSupabaseUser.sub);
    });

    it("should handle removal errors", async () => {
      const error = new Error("Deletion failed");
      mockUserService.remove.mockRejectedValue(error);

      await expect(controller.remove(mockUserId, mockSupabaseUser)).rejects.toThrow(
        "Deletion failed"
      );

      expect(mockUserService.remove).toHaveBeenCalledWith(mockUserId, mockSupabaseUser.sub);
    });
  });
});
