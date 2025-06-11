import { it, jest } from "@jest/globals";
import payrollService from "../../../src/services/payrollService.js";
import payrollRepository from "../../../src/repositories/payrollRepository.js";
import auditLogRepository from "../../../src/repositories/auditLogRepository.js";
import payslipRepository from "../../../src/repositories/payslipRepository.js";

jest.mock("../../../src/repositories/payrollRepository.js");
jest.mock("../../../src/repositories/auditLogRepository.js");
jest.mock("../../../src/repositories/payslipRepository.js");

describe("PayrollService", () => {
  const context = {
    userId: 1,
    ipAddress: "127.0.0.1",
  };

  beforeEach(() => {
    payrollRepository.getAttendancePeriodByPeriodId = jest.fn();
    payrollRepository.getActiveEmployees = jest.fn();
    payrollRepository.getAttendancesByPeriod = jest.fn();
    payrollRepository.getOvertimesByPeriod = jest.fn();
    payrollRepository.getReimbursementsByPeriod = jest.fn();
    payrollRepository.createPayroll = jest.fn();
    payrollRepository.lockAttendancePeriod = jest.fn();
    auditLogRepository.createInsertAuditLog = jest.fn();
    auditLogRepository.createUpdateAuditLog = jest.fn();
    payslipRepository.CreatePayslip = jest.fn();
    jest.clearAllMocks();
  });

  describe("runPayroll", () => {
    it("should return success when payroll runs successfully", async () => {
        const attendancePeriodId = 1;
    
        payrollRepository.getAttendancePeriodByPeriodId.mockResolvedValue({
          id: attendancePeriodId,
          startDate: "2025-06-01",
          endDate: "2025-06-30",
          isLocked: false,
        });
    
        payrollRepository.getActiveEmployees.mockResolvedValue([
          { id: 1, salary: 4000 },
        ]);
    
        payrollRepository.getAttendancesByPeriod.mockResolvedValue([
          { employeeId: 1 },
          { employeeId: 1 },
        ]);
    
        payrollRepository.getOvertimesByPeriod.mockResolvedValue([
          { employeeId: 1, hours: 5 },
        ]);
    
        payrollRepository.getReimbursementsByPeriod.mockResolvedValue([
          { employeeId: 1, amount: 100 },
        ]);
    
        payrollRepository.createPayroll.mockResolvedValue({ id: 10 });
    
        payrollRepository.lockAttendancePeriod.mockResolvedValue({
          id: 1,
          isLocked: true,
        });
    
        auditLogRepository.createInsertAuditLog.mockResolvedValue();
        auditLogRepository.createUpdateAuditLog.mockResolvedValue();
    
        payslipRepository.CreatePayslip.mockResolvedValue({ id: 101 });
    
        const result = await payrollService.runPayroll(attendancePeriodId, context);
    
        expect(result).toEqual({
          success: true,
          status: 200,
          message: "Payroll run successfully",
          data: {
            payroll: { id: 10 },
          },
        });
    
        expect(
          payrollRepository.getAttendancePeriodByPeriodId
        ).toHaveBeenCalledWith(attendancePeriodId, expect.anything());
        expect(payrollRepository.createPayroll).toHaveBeenCalled();
        expect(payslipRepository.CreatePayslip).toHaveBeenCalled();
      });
    
      it("should return error if attendance period not found", async () => {
        payrollRepository.getAttendancePeriodByPeriodId.mockResolvedValue(null);
    
        const result = await payrollService.runPayroll(999, context);
    
        expect(result).toEqual({
          success: false,
          status: 400,
          message: "Attendance period not found",
        });
      });
    
      it("should return error if attendance period is locked", async () => {
        payrollRepository.getAttendancePeriodByPeriodId.mockResolvedValue({
          id: 1,
          startDate: "2025-06-01",
          endDate: "2025-06-30",
          isLocked: true,
        });
    
        const result = await payrollService.runPayroll(1, context);
    
        expect(result).toEqual({
          success: false,
          status: 400,
          message: "Attendance period is locked",
        });
      });
      it("should return error if payroll creation fails", async () => {
        payrollRepository.getAttendancePeriodByPeriodId.mockResolvedValue({
          id: 1,
          startDate: "2025-06-01",
          endDate: "2025-06-30",
          isLocked: false,
        });
        payrollRepository.getActiveEmployees.mockResolvedValue([
          { id: 1, salary: 4000 },
        ]);
        payrollRepository.getAttendancesByPeriod.mockResolvedValue([
          { employeeId: 1 },
          { employeeId: 1 },
        ]);
        payrollRepository.getOvertimesByPeriod.mockResolvedValue([
          { employeeId: 1, hours: 5 },
        ]);
        payrollRepository.getReimbursementsByPeriod.mockResolvedValue([
          { employeeId: 1, amount: 100 },
        ]);
        payrollRepository.createPayroll.mockResolvedValue(null);
        const result = await payrollService.runPayroll(1, context);
        expect(result).toEqual({
          success: false,
          status: 400,
          message: "Failed to create payroll",
        });
      });
    
      it("should return error if no active employees", async () => {
        payrollRepository.getAttendancePeriodByPeriodId.mockResolvedValue({
          id: 1,
          startDate: "2025-06-01",
          endDate: "2025-06-30",
          isLocked: false,
        });
        payrollRepository.getActiveEmployees.mockResolvedValue([]);
    
        const result = await payrollService.runPayroll(1, context);
    
        expect(result).toEqual({
          success: false,
          status: 400,
          message: "No active employees",
        });
      });
      it("should return error if payslip creation fails", async () => {
        payrollRepository.getAttendancePeriodByPeriodId.mockResolvedValue({
          id: 1,
          startDate: "2025-06-01",
          endDate: "2025-06-30",
          isLocked: false,
        });
        payrollRepository.getActiveEmployees.mockResolvedValue([
          { id: 1, salary: 4000 },
        ])
        payrollRepository.getAttendancesByPeriod.mockResolvedValue([
          { employeeId: 1 },
          { employeeId: 1 },
        ])
        payrollRepository.getOvertimesByPeriod.mockResolvedValue([
          { employeeId: 1, hours: 5 },
        ])
        payrollRepository.getReimbursementsByPeriod.mockResolvedValue([
          { employeeId: 1, amount: 100 },
        ])
        payrollRepository.createPayroll.mockResolvedValue({ id: 10 })   
        payslipRepository.CreatePayslip.mockResolvedValue(null);
        const result = await payrollService.runPayroll(1, context);
        expect(result).toEqual({
          success: false,
          status: 400,
          message: "Failed to create payslip",
        });
      });
    
      it("should return error if lock attendance period fails", async () => {
        payrollRepository.getAttendancePeriodByPeriodId.mockResolvedValue({
          id: 1,
          startDate: "2025-06-01",
          endDate: "2025-06-30",
          isLocked: false,
        });
      
        payrollRepository.getActiveEmployees.mockResolvedValue([
          { id: 1, salary: 4000 },
        ]);
      
        payrollRepository.getAttendancesByPeriod.mockResolvedValue([
          { employeeId: 1 },
          { employeeId: 1 },
        ]);
      
        payrollRepository.getOvertimesByPeriod.mockResolvedValue([
          { employeeId: 1, hours: 5 },
        ]);
      
        payrollRepository.getReimbursementsByPeriod.mockResolvedValue([
          { employeeId: 1, amount: 100 },
        ]);
      
        payrollRepository.createPayroll.mockResolvedValue({ id: 10 });
        payslipRepository.CreatePayslip.mockResolvedValue({ id: 101 });
        auditLogRepository.createInsertAuditLog.mockResolvedValue();
        payrollRepository.lockAttendancePeriod.mockResolvedValue(null);
      
        const result = await payrollService.runPayroll(1, context);
      
        expect(result).toEqual({
          success: false,
          status: 400,
          message: "Failed to lock attendance period",
        });
      }); 
  }) 
});
