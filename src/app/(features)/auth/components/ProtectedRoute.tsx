"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { signOut, useSession } from "next-auth/react";
import Loader from "@/components/Loader";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { status } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    // Redirect to sign-in page if the user is unauthenticated
    // Also check if the user is on the sign-in or sign-up page to avoid redirect loop
    if (
      status === "unauthenticated" &&
      pathName !== ROUTES.SIGNIN &&
      pathName !== ROUTES.SIGNUP
    ) {
      signOut({ redirect: false });
      router.push(ROUTES.SIGNIN);
    }
  }, [status, pathName, router]);

  if (status === "loading") {
    return <Loader />;
  }

  return children;
}
