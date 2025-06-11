import { jest } from "@jest/globals";
import attendanceService from "../../../src/services/attendanceService.js";
import AttendanceRepository from "../../../src/repositories/attendanceRepository.js";
import auditLogRepository from "../../../src/repositories/auditLogRepository.js";

jest.mock("../../../src/repositories/attendanceRepository.js");
jest.mock("../../../src/repositories/auditLogRepository.js");

describe("AttendanceService", () => {
    const context = {
        userId: 1,
        ipAddress: "127.0.0.1",
    };
    beforeEach(() => {

        AttendanceRepository.createAttendancePeriod = jest.fn();
        AttendanceRepository.submitAttendance = jest.fn();
        AttendanceRepository.getAttendanceByEmployeeIdAndDate = jest.fn();
        auditLogRepository.createInsertAuditLog = jest.fn();
        jest.clearAllMocks();
    })

    describe("createAttendancePeriod", () => {
        it("should create attendance period and return success", async () => {
            const mockAttendance = { id: 1, startDate: "2025-06-01", endDate: "2025-06-30" };
            AttendanceRepository.createAttendancePeriod.mockResolvedValue(mockAttendance);
            auditLogRepository.createInsertAuditLog.mockResolvedValue();

            const result = await attendanceService.createAttendancePeriod("2025-06-01", "2025-06-30", context);

            expect(result).toEqual({
                success: true,
                status: 200,
                message: "Attendance period created successfully",
                data: mockAttendance,
            });
        });

        it("should throw error if creation fails", async () => {
            AttendanceRepository.createAttendancePeriod.mockResolvedValue(null);

            await expect(attendanceService.createAttendancePeriod("2025-06-01", "2025-06-30", context))
                .rejects
                .toThrow("Attendance period creation failed");
        });
    });

    describe("submitAttendance", () => {
        const validDate = "2025-06-10";

        it("should return 400 for weekend", async () => {
            const weekendDate = "2025-06-08"; 

            const result = await attendanceService.submitAttendance(weekendDate, context);
            expect(result).toEqual({
                success: false,
                status: 400,
                message: "Attendance cannot be submitted on weekends",
            });
        });

        it("should return 400 if attendance already submitted", async () => {
            AttendanceRepository.getAttendanceByEmployeeIdAndDate.mockResolvedValue(true);

            const result = await attendanceService.submitAttendance(validDate, context);
            expect(result).toEqual({
                success: false,
                status: 400,
                message: "Attendance has already been submitted for this date",
            });
        });

        it("should return 400 if attendance submission fails", async () => {
            AttendanceRepository.getAttendanceByEmployeeIdAndDate.mockResolvedValue(false);
            AttendanceRepository.submitAttendance.mockResolvedValue(null);

            const result = await attendanceService.submitAttendance(validDate, context);
            expect(result).toEqual({
                success: false,
                status: 400,
                message: "Attendance submission failed",
            });
        });

        it("should submit attendance and return success", async () => {
            const mockAttendance = { id: 1, attendanceDate: validDate };

            AttendanceRepository.getAttendanceByEmployeeIdAndDate.mockResolvedValue(false);
            AttendanceRepository.submitAttendance.mockResolvedValue(mockAttendance);
            auditLogRepository.createInsertAuditLog.mockResolvedValue();

            const result = await attendanceService.submitAttendance(validDate, context);
            expect(result).toEqual({
                success: true,
                status: 200,
                message: "Attendance submitted successfully",
                data: mockAttendance,
            });
        });
    });
});
