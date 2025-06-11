import { runTransaction } from "../../utils/runTransaction.js";
import auditLogRepository from "../repositories/auditLogRepository.js";
import payrollRepository from "../repositories/payrollRepository.js";
import payslipRepository from "../repositories/payslipRepository.js";

class PayrollService {
  async runPayroll(attendancePeriodId, context) {
    return await runTransaction(async (tx) => {
      const period = await payrollRepository.getAttendancePeriodByPeriodId(
        attendancePeriodId,
        tx
      );

      if (!period) {
        return {
          success: false,
          status: 400,
          message: "Attendance period not found",
        };
      }

      if (period.isLocked) {
        return {
          success: false,
          status: 400,
          message: "Attendance period is locked",
        };
      }

      const employees = await payrollRepository.getActiveEmployees(tx);
      if (!employees.length) {
        return {
          success: false,
          status: 400,
          message: "No active employees",
        };
      }
      const attendances = await payrollRepository.getAttendancesByPeriod(
        period.startDate,
        period.endDate,
        tx
      );
      const overtimes = await payrollRepository.getOvertimesByPeriod(
        period.startDate,
        period.endDate,
        tx
      );
      const reimbursements = await payrollRepository.getReimbursementsByPeriod(
        period.startDate,
        period.endDate,
        tx
      );

      const payroll = await payrollRepository.createPayroll(
        {
          attendancePeriodId: period.id,
          runAt: new Date(),
          ipAddress: context.ipAddress,
          createdBy: context.userId,
          updatedBy: context.userId,
        },
        tx
      );
      if (!payroll) {
        return {
          success: false,
          status: 400,
          message: "Failed to create payroll",
        };
      }
      await auditLogRepository.createInsertAuditLog(tx, {
        tableName: "Payroll",
        recordId: payroll.id,
        newData: {
          payroll,
        },
        context,
      });

        for (const employee of employees) {
            const attendanceDays = attendances.filter(
            (attendance) => attendance.employeeId === employee.id
            ).length;
            const overtimePay = overtimes
            .filter((overtime) => overtime.employeeId === employee.id)
            .reduce(
                (acc, overtime) =>
                acc + overtime.hours * ((employee.salary / 160) * 1.5),
                0
            );
            const reimbursementTotal = reimbursements
            .filter((reimbursement) => reimbursement.employeeId === employee.id)
            .reduce((acc, reimbursement) => acc + reimbursement.amount, 0);

            const baseSalary = employee.salary;
            const salaryPerDay = (baseSalary/20);
            const salary = salaryPerDay * attendanceDays;
            const takeHomePay = salary + overtimePay + reimbursementTotal;

            const result = await payslipRepository.CreatePayslip(
            {
                payrollId: payroll.id,
                employeeId: employee.id,
                attendanceDays,
                baseSalary,
                overtimePay,
                reimbursementTotal,
                takeHomePay,
                ipAddress: context.ipAddress,
                createdBy: context.userId,
                updatedBy: context.userId,
            },
            tx
            );

            if (!result) {
            return {
                success: false,
                status: 400,
                message: "Failed to create payslip",
            };
            }
            await auditLogRepository.createInsertAuditLog(tx, {
            tableName: "Payslip",
            recordId: result.id,
            newData: {
                result,
            },
            context,
            });
        }
        const lockAttendancePeriod = await payrollRepository.lockAttendancePeriod(
            period.id,
            tx
            );
            if (!lockAttendancePeriod) {
            return {
                success: false,
                status: 400,
                message: "Failed to lock attendance period",
            };
            }
            await auditLogRepository.createUpdateAuditLog(tx, {
            tableName: "AttendancePeriod",
            recordId: period.id,
            oldData: {
                period,
            },
            newData: {
                lockAttendancePeriod,
            },
            context,
            });

        return {
            success: true,
            status: 200,
            message: "Payroll run successfully",
            data: {
                payroll,
            },
            };
    });
  }
}

export default new PayrollService();
