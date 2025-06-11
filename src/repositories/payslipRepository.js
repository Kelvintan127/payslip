class PayslipRepository {
    async CreatePayslip(data, tx) {
        const result = await tx.payslip.create({
            data
        });
        return result;
    }

    async getAttendancePeriodById(id, tx) {
        const result = await tx.attendancePeriod.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async getEmployeeById(id, tx) {
        const result = await tx.employee.findUnique({
            where: {
                id,
                deletedAt: null
            }
        });
        return result;
    }

    async getPayrollById(id, tx) {
        const result = await tx.payroll.findUnique({
            where: {
                id
            }
        });
        return result;
    }

    async getPayslipByEmployeeIdAndPayrollId(employeeId, payrollId, tx) {
        const result = await tx.payslip.findFirst({
            where: {
                employeeId,
                payrollId
            }
        });
        return result;
    }

    async getReimbursementByEmployeeIdAndPeriod(employeeId, startDate, endDate, tx) {
        const result = await tx.reimbursement.findMany({
            where: {
                employeeId,
                reimbursementDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        return result;
    }

    async getPayslipByPayrollId(payrollId, tx) {
        const result = await tx.payslip.findMany({
            where: {
                payrollId
            },
            include: {
                employee: true
            }
        });
        return result;
    }

    async getOvertimeByEmployeeIdAndDate(employeeId, startDate, endDate, tx) {
        const result = await tx.overtime.findMany({
            where: {
                employeeId,
                overtimeDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        return result;
    }
}

export default new PayslipRepository();