import { Role } from "@prisma/client"

export class UserPreviewDTO {
  id: string
  firstname: string
  lastname: string
  school: string
  role: Role
}