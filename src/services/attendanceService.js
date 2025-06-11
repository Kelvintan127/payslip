import AttendanceRepository from "../repositories/attendanceRepository.js";
import { runTransaction } from "../../utils/runTransaction.js";
import auditLogRepository from "../repositories/auditLogRepository.js";

class AttendanceService {
    async createAttendancePeriod(startDate, endDate, context) {

        return await runTransaction(async (tx) => {
            const attendance = await AttendanceRepository.createAttendancePeriod(
                {
                startDate,
                endDate,
                ipAddress: context.ipAddress,
                createdBy: context.userId,
                updatedBy: context.userId,
                },
                tx
            );

            if (!attendance) {
                throw new Error("Attendance period creation failed");
            }
            await auditLogRepository.createInsertAuditLog(tx, {
                tableName: "AttendancePeriod",
                recordId: attendance.id,
                newData: {
                startDate,
                endDate,
                },
                context,
            });

            return {
                success: true,
                status: 200,
                message: "Attendance period created successfully",
                data: attendance,
            };
        });
    }

    async submitAttendance(date, context) {
        return await runTransaction(async (tx) => {
            const getDate = new Date(date);
            const day = getDate.getDay();

            if (day === 0 || day === 6) {
                return {
                    success: false,
                    status: 400,
                    message: "Attendance cannot be submitted on weekends",
                }
            }

            const isAttendanceSubmitted = await AttendanceRepository.getAttendanceByEmployeeIdAndDate(context.userId, date, tx);
            if (isAttendanceSubmitted) {
                return {
                    success: false,
                    status: 400,
                    message: "Attendance has already been submitted for this date",
                }
            }

            const attendance = await AttendanceRepository.submitAttendance(
                {
                employeeId: context.userId,
                attendanceDate: date,
                ipAddress: context.ipAddress,
                createdBy: context.userId,
                updatedBy: context.userId,
                },
                tx
            );
            if (!attendance) {
                return {
                    success: false,
                    status: 400,
                    message: "Attendance submission failed",
                }
            }
            await auditLogRepository.createInsertAuditLog(tx, {
                tableName: "Attendance",
                recordId: attendance.id,
                newData: {
                date,
                },
                context,
            });
            
            return {
                success: true,
                status: 200,
                message: "Attendance submitted successfully",
                data: attendance,
            }
        })
    }
}

export default new AttendanceService();
