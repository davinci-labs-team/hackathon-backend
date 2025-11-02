import { Role } from "@prisma/client";

export interface UserResponseReduced {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  school?: string | null;
  favoriteSubjectId?: string | null;
  teamId?: string | null;
}
