export const ROUTES = {
  HOME: "/",
  SIGNIN: "/auth/signin",
  SIGNUP: "/auth/signup",
  DASHBOARD: "/dashboard",
  DASHBOARD_USERS: "/dashboard/users",
  DASHBOARD_DOCS: "/dashboard/docs",
  UNAUTHORIZED: "/unauthorized",
  VIEW_DOC: "/dashboard/docs/view/",
};

export enum ROLES {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum INGESTION_STATUS {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  IN_PROGRESS = "IN_PROGRESS",
}
