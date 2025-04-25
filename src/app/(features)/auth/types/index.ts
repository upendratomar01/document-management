export type UserRole = "admin" | "user";

export type User = {
  email: string;
  role: UserRole;
};

export type AuthUser = {
  user: User;
  token: string;
};

export type SigninCreds = {
  email: string;
  password: string;
};

export type SignupCreds = SigninCreds & {
  name: string;
  allowExtraEmails: boolean;
};

export type AuthContextType = {
  user: User | null;
  signin: (creds: SigninCreds) => Promise<void>;
  signup: (creds: SignupCreds) => Promise<void>;
  logout: () => void;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};
