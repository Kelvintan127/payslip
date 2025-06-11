class OvertimeRepository {
    async getOvertimeByEmployeeIdAndDate(employeeId, date, tx) {
        const overtime = await tx.overtime.findFirst({
            where: {
                employeeId: employeeId,
                overtimeDate: date,
            },
        });
        return overtime;
    }

    async submitOvertime(data, tx) {
        const overtime = await tx.overtime.create({
            data
        });
        return overtime;
    }   
}

export default new OvertimeRepository();