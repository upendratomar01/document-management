import { ROLES } from "@/constants/routes";
import { getUsers, updateUserAction, deleteUserAction } from "./userActions";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  user: {
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("userActions", () => {
  describe("getUsers", () => {
    it("should fetch all users with selected fields", async () => {
      const mockUsers = [
        { id: "1", name: "John Doe", email: "john@example.com", role: "ADMIN" },
        { id: "2", name: "Jane Doe", email: "jane@example.com", role: "USER" },
      ];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const users = await getUsers();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        select: { id: true, name: true, email: true, role: true },
      });
      expect(users).toEqual(mockUsers);
    });
  });

  describe("updateUserAction", () => {
    it("should update a user with the provided data", async () => {
      const mockData = { id: "1", name: "John Updated", role: "USER" as ROLES };
      (prisma.user.update as jest.Mock).mockResolvedValue(undefined);

      await updateUserAction(mockData);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockData.id },
        data: { name: mockData.name, role: mockData.role },
      });
    });
  });

  describe("deleteUserAction", () => {
    it("should delete a user by id", async () => {
      const mockId = "1";
      (prisma.user.delete as jest.Mock).mockResolvedValue(undefined);

      await deleteUserAction(mockId);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: mockId },
      });
    });
  });
});
