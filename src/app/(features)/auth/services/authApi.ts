import { SigninCreds, SignupCreds } from "../types";

export const loginUser = async (creds: SigninCreds) => {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ ...creds }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const registerUser = async (creds: SignupCreds) => {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ ...creds }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
};
