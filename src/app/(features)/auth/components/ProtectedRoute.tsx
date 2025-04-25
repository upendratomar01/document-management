"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Non-auth user trying to access protected route
    if (!user && !pathname.startsWith("/auth")) {
      router.replace(ROUTES.SIGNIN);
    }

    // Auth user trying to access login/signup
    if (user && pathname.startsWith("/auth")) {
      router.replace(ROUTES.HOME);
    }
  }, [user, pathname, router]);

  return children;
}
