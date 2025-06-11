class AttendanceRepository {
    async createAttendancePeriod(data, tx) {
        const result = tx.attendancePeriod.create({
            data
        });
        return result;
    }

    async submitAttendance(data, tx) {
        const result = tx.attendance.create({
            data
        });
        return result;
    }

    async getAttendanceByEmployeeIdAndDate(employeeId, date, tx) {
        const result = tx.attendance.findFirst({
            where: {
                employeeId,
                attendanceDate: date,
            }
        });
        return result;
    }

}
export default new AttendanceRepository();