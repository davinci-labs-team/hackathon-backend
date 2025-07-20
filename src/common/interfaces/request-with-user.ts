import { Request } from "express";

export interface RequestWithUser extends Request {
  user: {
    sub: string;
    [key: string]: unknown; // optional, if you expect more fields
  };
}
