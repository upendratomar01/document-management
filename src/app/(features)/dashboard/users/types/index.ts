import { ROLES } from "@/constants/routes";

export type UserType = {
  id: string;
  name: string;
  email: string;
  role: ROLES;
};
