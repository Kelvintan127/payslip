import {jest} from '@jest/globals';
import authRepository from "../../../src/repositories/authRepository.js";
import prisma from "../../../utils/prisma.js";

jest.mock("../../../utils/prisma.js", () => ({
  admin: {
    findUnique: jest.fn(),
  },
  employee: {
    findUnique: jest.fn(),
  },
}));

describe("AuthRepository", () => {
  beforeEach(() => {
    prisma.admin.findUnique = jest.fn();
    prisma.employee.findUnique = jest.fn();
    jest.clearAllMocks();
  });

  describe("getAdminByUsername", () => {
    it("should return admin when found", async () => {
      const mockAdmin = { id: 1, username: "admin1" };
      prisma.admin.findUnique.mockResolvedValueOnce(mockAdmin);

      const result = await authRepository.getAdminByUsername("admin1");

      expect(prisma.admin.findUnique).toHaveBeenCalledWith({
        where: {
          username: "admin1",
          deletedAt: null,
        },
      });

      expect(result).toEqual(mockAdmin);
    });

    it("should return null if admin not found", async () => {
      prisma.admin.findUnique.mockResolvedValueOnce(null);

      const result = await authRepository.getAdminByUsername("unknown");

      expect(prisma.admin.findUnique).toHaveBeenCalledWith({
        where: {
          username: "unknown",
          deletedAt: null,
        },
      });

      expect(result).toBeNull();
    });
  });

  describe("getEmployeeByUsername", () => {
    it("should return employee when found", async () => {
      const mockEmployee = { id: 2, username: "employee1" };
      prisma.employee.findUnique.mockResolvedValueOnce(mockEmployee);

      const result = await authRepository.getEmployeeByUsername("employee1");

      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: {
          username: "employee1",
          deletedAt: null,
        },
      });

      expect(result).toEqual(mockEmployee);
    });

    it("should return null if employee not found", async () => {
      prisma.employee.findUnique.mockResolvedValueOnce(null);

      const result = await authRepository.getEmployeeByUsername("unknown");

      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: {
          username: "unknown",
          deletedAt: null,
        },
      });

      expect(result).toBeNull();
    });
  });
});
