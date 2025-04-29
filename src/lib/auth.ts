import { Session, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ROLES } from "@/constants/routes";
// Extend the User type to include the role property
declare module "next-auth" {
  interface User {
    role?: ROLES;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: ROLES;
    };
  }
}
// Extend the JWT type to include id and role
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role?: ROLES;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user; // Exclude password from the user object
        return {
          ...userWithoutPassword,
          role: userWithoutPassword.role as ROLES, // Ensure role matches the expected type
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Important: Add role to token
        token.email = user.email!;
        token.name = user.name!;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: { id: string; role?: ROLES; email: string; name: string };
    }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // Important: Add role to session
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Redirect unauthenticated users here
    error: "/auth/signin", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
