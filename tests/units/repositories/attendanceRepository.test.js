import { jest } from "@jest/globals";
import attendanceRepository from "../../../src/repositories/attendanceRepository.js";

describe("AttendanceRepository", () => {
  const tx = {
    attendancePeriod: {
      create: jest.fn(),
    },
    attendance: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createAttendancePeriod", () => {
    it("should create attendance period", async () => {
      const mockData = { startDate: "2025-06-01", endDate: "2025-06-30" };
      const mockResult = { id: 1, ...mockData };

      tx.attendancePeriod.create.mockResolvedValueOnce(mockResult);

      const result = await attendanceRepository.createAttendancePeriod(mockData, tx);

      expect(tx.attendancePeriod.create).toHaveBeenCalledWith({ data: mockData });
      expect(result).toEqual(mockResult);
    });
  });

  describe("submitAttendance", () => {
    it("should submit attendance", async () => {
      const mockData = {
        employeeId: 1,
        attendanceDate: "2025-06-10",
      };
      const mockResult = { id: 1, ...mockData };

      tx.attendance.create.mockResolvedValueOnce(mockResult);

      const result = await attendanceRepository.submitAttendance(mockData, tx);

      expect(tx.attendance.create).toHaveBeenCalledWith({ data: mockData });
      expect(result).toEqual(mockResult);
    });
  });

  describe("getAttendanceByEmployeeIdAndDate", () => {
    it("should get attendance by employeeId and date", async () => {
      const employeeId = 1;
      const date = "2025-06-10";
      const mockResult = {
        id: 1,
        employeeId,
        attendanceDate: date,
      };

      tx.attendance.findFirst.mockResolvedValueOnce(mockResult);

      const result = await attendanceRepository.getAttendanceByEmployeeIdAndDate(employeeId, date, tx);

      expect(tx.attendance.findFirst).toHaveBeenCalledWith({
        where: {
          employeeId,
          attendanceDate: date,
        },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
