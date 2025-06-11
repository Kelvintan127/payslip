import {jest} from '@jest/globals';
import PayslipRepository from "../../../src/repositories/payslipRepository";

describe("PayslipRepository", () => {
  const tx = {
    payslip: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    attendancePeriod: {
      findUnique: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
    payroll: {
      findUnique: jest.fn(),
    },
    reimbursement: {
      findMany: jest.fn(),
    },
    overtime: {
      findMany: jest.fn(),
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create payslip", async () => {
    const data = { employeeId: 1, payrollId: 2 };
    tx.payslip.create.mockResolvedValue(data);
    const result = await PayslipRepository.CreatePayslip(data, tx);
    expect(result).toEqual(data);
    expect(tx.payslip.create).toHaveBeenCalledWith({ data });
  });

  it("should get attendance period by id", async () => {
    const resultMock = { id: 1 };
    tx.attendancePeriod.findUnique.mockResolvedValue(resultMock);
    const result = await PayslipRepository.getAttendancePeriodById(1, tx);
    expect(result).toEqual(resultMock);
    expect(tx.attendancePeriod.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should get employee by id and not deleted", async () => {
    const resultMock = { id: 1, deletedAt: null };
    tx.employee.findUnique.mockResolvedValue(resultMock);
    const result = await PayslipRepository.getEmployeeById(1, tx);
    expect(result).toEqual(resultMock);
    expect(tx.employee.findUnique).toHaveBeenCalledWith({ where: { id: 1, deletedAt: null } });
  });

  it("should get payroll by id", async () => {
    const resultMock = { id: 1 };
    tx.payroll.findUnique.mockResolvedValue(resultMock);
    const result = await PayslipRepository.getPayrollById(1, tx);
    expect(result).toEqual(resultMock);
    expect(tx.payroll.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should get payslip by employee and payroll id", async () => {
    const resultMock = { id: 1 };
    tx.payslip.findFirst.mockResolvedValue(resultMock);
    const result = await PayslipRepository.getPayslipByEmployeeIdAndPayrollId(1, 2, tx);
    expect(result).toEqual(resultMock);
    expect(tx.payslip.findFirst).toHaveBeenCalledWith({ where: { employeeId: 1, payrollId: 2 } });
  });

  it("should get reimbursements by employee and period", async () => {
    const resultMock = [{ id: 1 }];
    tx.reimbursement.findMany.mockResolvedValue(resultMock);
    const result = await PayslipRepository.getReimbursementByEmployeeIdAndPeriod(1, "2025-01-01", "2025-01-31", tx);
    expect(result).toEqual(resultMock);
    expect(tx.reimbursement.findMany).toHaveBeenCalledWith({
      where: {
        employeeId: 1,
        reimbursementDate: { gte: "2025-01-01", lte: "2025-01-31" },
      },
    });
  });

  it("should get payslips by payroll id including employee", async () => {
    const resultMock = [{ id: 1, employee: {} }];
    tx.payslip.findMany.mockResolvedValue(resultMock);
    const result = await PayslipRepository.getPayslipByPayrollId(1, tx);
    expect(result).toEqual(resultMock);
    expect(tx.payslip.findMany).toHaveBeenCalledWith({ where: { payrollId: 1 }, include: { employee: true } });
  });

  it("should get overtime by employee and period", async () => {
    const resultMock = [{ id: 1 }];
    tx.overtime.findMany.mockResolvedValue(resultMock);
    const result = await PayslipRepository.getOvertimeByEmployeeIdAndDate(1, "2025-01-01", "2025-01-31", tx);
    expect(result).toEqual(resultMock);
    expect(tx.overtime.findMany).toHaveBeenCalledWith({
      where: {
        employeeId: 1,
        overtimeDate: { gte: "2025-01-01", lte: "2025-01-31" },
      },
    });
  });
});
