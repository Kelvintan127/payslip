import { jest } from "@jest/globals";
import reimburseService from "../../../src/services/reimburseService.js";
import reimburseRepository from "../../../src/repositories/reimburseRepository.js";
import auditLogRepository from "../../../src/repositories/auditLogRepository.js";

describe("reimburseService", () => {
  const context = {
    user: {
      id: 1,
      ipAddress: "127.0.0.1",
    },
  };
  let req;
  let res;

  beforeEach(() => {
    req = {
      context: { userId: 1, ipAddress: "127.0.0.1" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    reimburseRepository.submitReimburse = jest.fn();
    auditLogRepository.createInsertAuditLog = jest.fn();
    jest.clearAllMocks();
  });

  describe("submitReimburse", () => {
    it("should submit reimburse and return success", async () => {
      const reimburseData = {
        reimbursementDate: "2025-01-01",
        amount: 100000,
        description: "test",
      };

      reimburseRepository.submitReimburse.mockResolvedValueOnce({
        id: 1,
        reimbursementDate: "2021-01-01",
        amount: 100000,
        description: "test",
        employeeId: 1,
        payslipId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01",
      });
      const result = await reimburseService.submitReimburse(
        reimburseData,
        context
      );
      expect(result).toEqual(
        expect.objectContaining({
          success: true,
          status: 200,
          message: "Reimburse submitted successfully",
          data: expect.objectContaining({
            id: 1,
            reimbursementDate: "2021-01-01",
            amount: 100000,
            description: "test",
            employeeId: 1,
            payslipId: 1,
            createdBy: 1,
            updatedBy: 1,
            createdAt: "2021-01-01",
            updatedAt: "2021-01-01",
          }),
        })
      );
    });

    it("should return error if submit reimburse failed", async () => {
      const reimburse = {
        reimbursementDate: "2021-01-01",
        amount: 100000,
        description: "test",
        payslipId: 1,
      };
      reimburseRepository.submitReimburse.mockResolvedValueOnce(false);
      const result = await reimburseService.submitReimburse(reimburse, context);
      expect(result).toEqual({
        success: false,
        status: 400,
        message: "Reimburse submission failed",
      });
    });
  });
});
