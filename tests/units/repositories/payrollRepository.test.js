import {jest} from '@jest/globals';
import PayrollRepository from "../../../src/repositories/payrollRepository.js";

const tx = {
  attendancePeriod: {
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  employee: {
    findMany: jest.fn(),
  },
  overtime: {
    findMany: jest.fn(),
  },
  reimbursement: {
    findMany: jest.fn(),
  },
  attendance: {
    findMany: jest.fn(),
  },
  payroll: {
    create: jest.fn(),
  },
};

describe("PayrollRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should lock attendance period", async () => {
    const mockResult = { id: 1, isLocked: true };
    tx.attendancePeriod.update.mockResolvedValueOnce(mockResult);

    const result = await PayrollRepository.lockAttendancePeriod(1, tx);

    expect(tx.attendancePeriod.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isLocked: true },
    });
    expect(result).toEqual(mockResult);
  });

  it("should get attendance period by period ID", async () => {
    const mockResult = { id: 1, periodName: "May 2025" };
    tx.attendancePeriod.findFirst.mockResolvedValueOnce(mockResult);

    const result = await PayrollRepository.getAttendancePeriodByPeriodId(1, tx);

    expect(tx.attendancePeriod.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockResult);
  });

  it("should get active employees", async () => {
    const mockResult = [{ id: 1 }, { id: 2 }];
    tx.employee.findMany.mockResolvedValueOnce(mockResult);

    const result = await PayrollRepository.getActiveEmployees(tx);

    expect(tx.employee.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
    });
    expect(result).toEqual(mockResult);
  });

  it("should get overtimes by period", async () => {
    const mockResult = [{ id: 1, overtimeDate: "2025-06-01" }];
    tx.overtime.findMany.mockResolvedValueOnce(mockResult);

    const result = await PayrollRepository.getOvertimesByPeriod("2025-06-01", "2025-06-30", tx);

    expect(tx.overtime.findMany).toHaveBeenCalledWith({
      where: {
        overtimeDate: {
          gte: "2025-06-01",
          lte: "2025-06-30",
        },
      },
    });
    expect(result).toEqual(mockResult);
  });

  it("should get reimbursements by period", async () => {
    const mockResult = [{ id: 1, reimbursementDate: "2025-06-05" }];
    tx.reimbursement.findMany.mockResolvedValueOnce(mockResult);

    const result = await PayrollRepository.getReimbursementsByPeriod("2025-06-01", "2025-06-30", tx);

    expect(tx.reimbursement.findMany).toHaveBeenCalledWith({
      where: {
        reimbursementDate: {
          gte: "2025-06-01",
          lte: "2025-06-30",
        },
      },
    });
    expect(result).toEqual(mockResult);
  });

  it("should get attendances by period", async () => {
    const mockResult = [{ id: 1, attendanceDate: "2025-06-10" }];
    tx.attendance.findMany.mockResolvedValueOnce(mockResult);

    const result = await PayrollRepository.getAttendancesByPeriod("2025-06-01", "2025-06-30", tx);

    expect(tx.attendance.findMany).toHaveBeenCalledWith({
      where: {
        attendanceDate: {
          gte: "2025-06-01",
          lte: "2025-06-30",
        },
      },
    });
    expect(result).toEqual(mockResult);
  });

  it("should create payroll", async () => {
    const mockPayroll = {
      employeeId: 1,
      attendancePeriodId: 1,
      runAt: "2025-06-30",
    };
    const mockResult = { id: 1, ...mockPayroll };

    tx.payroll.create.mockResolvedValueOnce(mockResult);

    const result = await PayrollRepository.createPayroll(mockPayroll, tx);

    expect(tx.payroll.create).toHaveBeenCalledWith({
      data: mockPayroll,
    });
    expect(result).toEqual(mockResult);
  });
});
