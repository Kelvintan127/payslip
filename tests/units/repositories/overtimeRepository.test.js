import {jest} from '@jest/globals';
import OvertimeRepository from "../../../src/repositories/overtimeRepository.js";

const tx = {
  overtime: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

describe("OvertimeRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOvertimeByEmployeeIdAndDate", () => {
    it("should return overtime record when found", async () => {
      const mockOvertime = {
        id: 1,
        employeeId: 1,
        overtimeDate: "2025-06-01",
        duration: 2,
      };

      tx.overtime.findFirst.mockResolvedValueOnce(mockOvertime);

      const result = await OvertimeRepository.getOvertimeByEmployeeIdAndDate(
        1,
        "2025-06-01",
        tx
      );

      expect(tx.overtime.findFirst).toHaveBeenCalledWith({
        where: {
          employeeId: 1,
          overtimeDate: "2025-06-01",
        },
      });

      expect(result).toEqual(mockOvertime);
    });

    it("should return null when no record found", async () => {
      tx.overtime.findFirst.mockResolvedValueOnce(null);

      const result = await OvertimeRepository.getOvertimeByEmployeeIdAndDate(
        2,
        "2025-06-01",
        tx
      );

      expect(result).toBeNull();
    });
  });

  describe("submitOvertime", () => {
    it("should create and return overtime record", async () => {
      const mockData = {
        employeeId: 1,
        overtimeDate: "2025-06-01",
        duration: 3,
      };

      const mockCreated = { id: 10, ...mockData };

      tx.overtime.create.mockResolvedValueOnce(mockCreated);

      const result = await OvertimeRepository.submitOvertime(mockData, tx);

      expect(tx.overtime.create).toHaveBeenCalledWith({
        data: mockData,
      });

      expect(result).toEqual(mockCreated);
    });
  });
});
