class PayrollRepository  {
    async lockAttendancePeriod(periodId, tx) {
        const result = await tx.attendancePeriod.update({
            where: {
                id: periodId
            },
            data: {
                isLocked: true
            }
        });
        return result;
    }

    async getAttendancePeriodByPeriodId(periodId, tx) {
        const result = await tx.attendancePeriod.findFirst({
            where: {
                id: periodId
            }
        });
        return result;
    }

    async getActiveEmployees(tx) {
        const result = await tx.employee.findMany({
            where: {
                deletedAt: null
            }
        });
        return result;
    }

    async getOvertimesByPeriod(startDate, endDate, tx) {
        const result = await tx.overtime.findMany({
            where: {
                overtimeDate: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        return result;
    }

    async getReimbursementsByPeriod(startDate, endDate, tx) {
        const result = await tx.reimbursement.findMany({
            where: {
                reimbursementDate: {
                    gte: startDate,
                    lte: endDate
                },
            }
        });
        return result;
    }

    async getAttendancesByPeriod(startDate, endDate, tx) {
        const result = await tx.attendance.findMany({
            where: {
                attendanceDate: {
                    gte: startDate,
                    lte: endDate
                },
            }
        });
        return result;
    }

    async createPayroll(data, tx) {
        const result = await tx.payroll.create({
            data
        });
        return result;
    }
    
}

export default new PayrollRepository();