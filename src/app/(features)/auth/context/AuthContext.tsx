"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  AuthContextType,
  AuthProviderProps,
  SigninCreds,
  SignupCreds,
  User,
} from "@/app/(features)/auth/types";
import { loginUser, registerUser } from "../services/authApi";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../constants";
import { ROUTES } from "@/constants/routes";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem(AUTH_USER_KEY);
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const signin = async (creds: SigninCreds) => {
    const res = await loginUser(creds);
    setUser(res.user);
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
    sessionStorage.setItem(AUTH_TOKEN_KEY, res.token);
    router.push(ROUTES.HOME); // Redirect to home after login
  };

  const signup = async (creds: SignupCreds) => {
    await registerUser(creds);
    await signin(creds); // Auto login after signup
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
    router.push(ROUTES.SIGNIN); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, signin, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
