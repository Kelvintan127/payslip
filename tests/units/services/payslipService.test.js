import {it, jest} from '@jest/globals';
import payrollRepository from '../../../src/repositories/payrollRepository.js';
import payslipRepository from '../../../src/repositories/payslipRepository.js';
import payslipService from '../../../src/services/payslipService.js';
import auditLogRepository from '../../../src/repositories/auditLogRepository.js';
describe('PayslipService', () => {
    beforeEach(() => {
        payrollRepository.createPayroll = jest.fn();
        payrollRepository.getActiveEmployees = jest.fn();
        payrollRepository.getAttendancePeriodByPeriodId = jest.fn();
        payrollRepository.getAttendancesByPeriod = jest.fn();
        payrollRepository.getOvertimesByPeriod = jest.fn();
        payrollRepository.getReimbursementsByPeriod = jest.fn();
        payrollRepository.lockAttendancePeriod = jest.fn();
        payslipRepository.CreatePayslip = jest.fn();
        payslipRepository.getAttendancePeriodById = jest.fn();
        payslipRepository.getEmployeeById = jest.fn();
        payslipRepository.getOvertimeByEmployeeIdAndDate = jest.fn();
        payslipRepository.getPayrollById = jest.fn();
        payslipRepository.getPayslipByEmployeeIdAndPayrollId = jest.fn();
        payslipRepository.getPayslipByPayrollId = jest.fn();
        payslipRepository.getReimbursementByEmployeeIdAndPeriod = jest.fn();
        auditLogRepository.createInsertAuditLog = jest.fn();
        auditLogRepository.createUpdateAuditLog = jest.fn();
        jest.clearAllMocks();
    })

    describe('generatePayslip', () => {
        it('should generate payslip successfully', async () => {
          const employeeId = 1;
          const payrollId = 2;
      
          const employee = { id: 1, salary: 4000 };
          const payroll = { id: 2, attendancePeriodId: 3 };
          const attendancePeriod = {
            id: 3,
            startDate: '2025-06-01',
            endDate: '2025-06-30',
            isLocked: true
          };
          const payslip = {
            payrollId: 2,
            attendanceDays: 10,
            baseSalary: 4000,
            overtimePay: 300,
            reimbursementTotal: 200,
            takeHomePay: 2700,
          };
          const reimbursement = [
            { id: 1, reimbursementDate: '2025-06-15', amount: 100, description: "Transport" },
            { id: 2, reimbursementDate: '2025-06-20', amount: 100, description: "Meal" },
          ];
          const overtime = [
            { id: 1, overtimeDate: '2025-06-10', hours: 2 },
            { id: 2, overtimeDate: '2025-06-12', hours: 3 },
          ];
      
          payslipRepository.getEmployeeById.mockResolvedValue(employee);
          payslipRepository.getPayrollById.mockResolvedValue(payroll);
          payslipRepository.getAttendancePeriodById.mockResolvedValue(attendancePeriod);
          payslipRepository.getPayslipByEmployeeIdAndPayrollId.mockResolvedValue(payslip);
          payslipRepository.getReimbursementByEmployeeIdAndPeriod.mockResolvedValue(reimbursement);
          payslipRepository.getOvertimeByEmployeeIdAndDate.mockResolvedValue(overtime);
      
          const result = await payslipService.generatePayslip(employeeId, payrollId);
      
          expect(result).toEqual(
            expect.objectContaining({
              success: true,
              status: 200,
              message: "Payslip generated successfully",
              data: expect.objectContaining({
                employeeId,
                payrollId,
                baseSalary: 4000,
                overtimePay: 300,
                reimbursementTotal: 200,
                salaryFormula: expect.any(String),
                overtimeFormula: expect.any(String),
              }),
            })
          );
        });

        it('should return error when employee not found', async () => {
            const employeeId = 1;
            const payrollId = 2;
            payslipRepository.getEmployeeById.mockResolvedValue(null);
            const result = await payslipService.generatePayslip(employeeId, payrollId);
            expect(result).toEqual(
              expect.objectContaining({
                success: false,
                status: 400,
                message: "Employee not found",
              })
            );
        })

        it('should return error when payroll not found', async () => {
            const employeeId = 1;
            const payrollId = 2;
            payslipRepository.getEmployeeById.mockResolvedValue({ id: 1, salary: 4000 });
            payslipRepository.getPayrollById.mockResolvedValue(null);
            const result = await payslipService.generatePayslip(employeeId, payrollId);
            expect(result).toEqual(
              expect.objectContaining({
                success: false,
                status: 400,
                message: "Payroll not found",
              })
            );
        });
        
        it('should return error when attendance period is still active (not locked)', async () => {
            const employeeId = 1;
            const payrollId = 2;

            payslipRepository.getEmployeeById.mockResolvedValue({ id: 1, salary: 4000 });
            payslipRepository.getPayrollById.mockResolvedValue({ id: 2, attendancePeriodId: 3 });
            payslipRepository.getAttendancePeriodById.mockResolvedValue({
              id: 3,
              startDate: '2025-06-01',
              endDate: '2025-06-30',
              isLocked: false 
            });

            const result = await payslipService.generatePayslip(employeeId, payrollId);
            
            expect(result).toEqual(
              expect.objectContaining({
                success: false,
                status: 400,
                message: "Attendance period is still active",
              })
            );
        });

        it('should return error when attendance period not found', async () => {
          const employeeId = 1;
          const payrollId = 2;
          payslipRepository.getEmployeeById.mockResolvedValue({ id: 1, salary: 4000 });
          payslipRepository.getPayrollById.mockResolvedValue({ id: 2, attendancePeriodId: 3 });
          payslipRepository.getAttendancePeriodById.mockResolvedValue(null);
          const result = await payslipService.generatePayslip(employeeId, payrollId);
          expect(result).toEqual(
            expect.objectContaining({
              success: false,
              status: 400,
              message: "Attendance period not found",
            })
          );    
        });

        it('should return error when payslip not found', async () => {
            const employeeId = 1;
            const payrollId = 2;
          
            payslipRepository.getEmployeeById.mockResolvedValue({ id: 1, salary: 4000 });
            payslipRepository.getPayrollById.mockResolvedValue({ id: 2, attendancePeriodId: 3 });
            payslipRepository.getAttendancePeriodById.mockResolvedValue({
              id: 3,
              startDate: '2025-06-01',
              endDate: '2025-06-30',
              isLocked: true
            });
            payslipRepository.getPayslipByEmployeeIdAndPayrollId.mockResolvedValue(null);
          
            const result = await payslipService.generatePayslip(employeeId, payrollId);
          
            expect(result).toEqual(
              expect.objectContaining({
                success: false,
                status: 400,
                message: "Payslip not found",
              })
            );
          });
      });

      describe('generateSummaryPayslip', () => {
        it('should generate summary payslip successfully', async () => {
          const payrollId = 2;
          const payslips = [
            {
              id: 1,
              employeeId: 1,
              payrollId: 2,
              attendanceDays: 10,
              baseSalary: 4000, 
              overtimePay: 300,
              reimbursementTotal: 200,
              takeHomePay: 2700,
              employee: {
                id: 1,
                name: "John Doe",
              }
            }
          ]
          payslipRepository.getPayslipByPayrollId.mockResolvedValue(payslips);

          const result = await payslipService.generateSummaryPayslip(payrollId);

          expect(result).toEqual(
            expect.objectContaining({
              success: true,
              status: 200,
              message: "Payslip generated successfully",
              data: expect.objectContaining({
                payrollId: payrollId,
                employees: expect.arrayContaining([
                  expect.objectContaining({
                    employeeId: 1,
                    employeeName: "John Doe",
                    takeHomePay: 2700
                  })
                ]),
                totalTakeHomePay: 2700
              })
            })
          );          
        });
        it('should return error when payslip not found', async () => {
          const payrollId = 2;
          payslipRepository.getPayslipByPayrollId.mockResolvedValue(null);
          const result = await payslipService.generateSummaryPayslip(payrollId);
          expect(result).toEqual(
            expect.objectContaining({
              success: false,
              status: 400,
              message: "Payslip not found",
            })
          )
        });
      });
      
})