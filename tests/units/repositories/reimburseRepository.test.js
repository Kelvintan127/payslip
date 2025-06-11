import {jest} from '@jest/globals';
import ReimburseRepository from "../../../src/repositories/reimburseRepository.js";

describe("ReimburseRepository", () => {
  const mockTx = {
    reimbursement: {
      create: jest.fn(),
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("submitReimburse", () => {
    it("should call tx.reimbursement.create with correct data and return result", async () => {
      const data = {
        employeeId: 1,
        reimbursementDate: new Date("2025-01-01"),
        amount: 100000,
        description: "Transport",
      };

      const mockResponse = {
        id: 1,
        ...data,
        createdAt: new Date("2025-01-01T10:00:00Z"),
        updatedAt: new Date("2025-01-01T10:00:00Z"),
      };

      mockTx.reimbursement.create.mockResolvedValueOnce(mockResponse);

      const result = await ReimburseRepository.submitReimburse(data, mockTx);

      expect(mockTx.reimbursement.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(mockResponse);
    });
  });
});
