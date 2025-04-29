import { renderHook } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRole } from "./useRole";
import { ROLES } from "@/constants/routes";

jest.mock("next-auth/react");

describe("useRole", () => {
  it("should return role as undefined and both isAdmin and isUser as false when session is not available", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBeUndefined();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isUser).toBe(false);
  });

  it("should return role as ADMIN and isAdmin as true when user role is ADMIN", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { role: ROLES.ADMIN } },
    });

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe(ROLES.ADMIN);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isUser).toBe(false);
  });

  it("should return role as USER and isUser as true when user role is USER", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { role: ROLES.USER } },
    });

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe(ROLES.USER);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isUser).toBe(true);
  });
});
