import { signIn } from "next-auth/react";
import { SigninCreds, SignupCreds } from "../types";

export const registerUser = async (creds: SignupCreds) => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ ...creds }),
  });
  return res.json();
};

export const loginUser = async (creds: SigninCreds) => {
  return await signIn("credentials", {
    email: creds.email,
    password: creds.password,
    redirect: false,
  });
};
