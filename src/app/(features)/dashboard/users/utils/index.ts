import { ROLES } from "@/constants/routes";
import * as Yup from "yup";

export const editUserValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string()
    .oneOf([ROLES.USER, ROLES.ADMIN])
    .required("Role is required"),
});
