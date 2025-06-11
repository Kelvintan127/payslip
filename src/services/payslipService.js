import payslipRepository from "../repositories/payslipRepository.js";
import { runTransaction } from "../../utils/runTransaction.js";

class payslipService {
    async generatePayslip(employeeId, payrollId) {
        return await runTransaction(async (tx) => {
            const employee = await payslipRepository.getEmployeeById(employeeId, tx);
            if (!employee) {
                return {
                    success: false,
                    status: 400,
                    message: "Employee not found",
                };
            }
    
            const payroll = await payslipRepository.getPayrollById(payrollId, tx);
            if (!payroll) {
                return {
                    success: false,
                    status: 400,
                    message: "Payroll not found",
                };
            }
    
            const attendancePeriod = await payslipRepository.getAttendancePeriodById(
                payroll.attendancePeriodId,
                tx
            );
    
            if (!attendancePeriod) {
                return {
                    success: false,
                    status: 400,
                    message: "Attendance period not found",
                };
            }
    
            if (!attendancePeriod.isLocked) {
                return {
                    success: false,
                    status: 400,
                    message: "Attendance period is still active",
                };
            }
    
            const payslip = await payslipRepository.getPayslipByEmployeeIdAndPayrollId(
                employee.id,
                payroll.id,
                tx
            );
    
            if (!payslip) {
                return {
                    success: false,
                    status: 400,
                    message: "Payslip not found",
                };
            }
    
            const baseSalary = employee.salary;
            const salaryPerDay = baseSalary / 20;
            const attendancePay = salaryPerDay * payslip.attendanceDays;
    
            const reimbursement = await payslipRepository.getReimbursementByEmployeeIdAndPeriod(
                employee.id,
                attendancePeriod.startDate,
                attendancePeriod.endDate,
                tx
            );
    
            const overtime = await payslipRepository.getOvertimeByEmployeeIdAndDate(
                employee.id,
                attendancePeriod.startDate,
                attendancePeriod.endDate,
                tx
            );
    
            return {
                success: true,
                status: 200,
                message: "Payslip generated successfully",
                data: {
                    employeeId: employee.id,
                    payrollId: payslip.payrollId,
                    attendanceDays: payslip.attendanceDays,
                    baseSalary: payslip.baseSalary,
                    attendancePay,
                    salaryFormula: "(base salary / 20) * attendance days",
                    overtimeList: overtime.map((o) => ({
                        id: o.id,
                        date: o.overtimeDate,
                        hours: o.hours,
                    })),
                    overtimePay: payslip.overtimePay,
                    overtimeFormula: "(overtime hours * (base salary / 160) * 1.5)",
                    reimbursementList: reimbursement.map((r) => ({
                        id: r.id,
                        date: r.reimbursementDate,
                        amount: r.amount,
                        description: r.description,
                    })),
                    reimbursementTotal: payslip.reimbursementTotal,
                    takeHomePay: payslip.takeHomePay,
                },
            };
        });
    }    

    async generateSummaryPayslip(payrollId) {
        return await runTransaction(async (tx) => {
            const payslips = await payslipRepository.getPayslipByPayrollId(payrollId, tx);
            if (!payslips) {
                return {
                    success: false,
                    status: 400,
                    message: "Payslip not found",
                };
            }
            
            const employeeSummary = payslips.map((payslip) => ({
                employeeId: payslip.employeeId,
                employeeName: payslip.employee.name,
                takeHomePay: payslip.takeHomePay,
            }));

            const totalTakeHomePay = employeeSummary.reduce((total, payslip) => total + payslip.takeHomePay, 0);
            
            return {
                success: true,
                status: 200,
                message: "Payslip generated successfully",
                data: {
                    payrollId,
                    employees: employeeSummary,
                    totalTakeHomePay,
                },
            };
        })   
    }

}

export default new payslipService();
