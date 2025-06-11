import {jest} from "@jest/globals";
import overtimeService from "../../../src/services/overtimeService.js";
import overtimeRepository from "../../../src/repositories/overtimeRepository.js";
import auditLogRepository from "../../../src/repositories/auditLogRepository.js";
describe("overtimeService", () => {
    const context = {
        user: {
            id: 1,
            role: "employee"
        }   
    }
    beforeEach(() => {
        overtimeRepository.getOvertimeByEmployeeIdAndDate = jest.fn();
        overtimeRepository.submitOvertime = jest.fn();
        auditLogRepository.createInsertAuditLog = jest.fn();
        jest.clearAllMocks();
    })

    describe("submitOvertime", () => {
        it("should submit overtime and return success", async () => {
            const mockOvertime = { id: 1, overtimeDate: "2025-06-01", overtimeHours: 1 };
            overtimeRepository.getOvertimeByEmployeeIdAndDate.mockResolvedValue(false);
            overtimeRepository.submitOvertime.mockResolvedValue(mockOvertime);
            auditLogRepository.createInsertAuditLog.mockResolvedValue();
            const result = await overtimeService.submitOvertime(1, "2025-06-01", context);
            expect(result).toEqual({
                success: true,
                status: 201,
                message: "Overtime submitted successfully",
                data: mockOvertime
            });
        });
        it ("should return error if overtime has already been submitted", async () => {
            const mockOvertime = { id: 1, overtimeDate: "2025-06-01", overtimeHours: 1 };
            overtimeRepository.getOvertimeByEmployeeIdAndDate.mockResolvedValue(mockOvertime);
            const result = await overtimeService.submitOvertime(1, "2025-06-01", context);
            expect(result).toEqual({
                success: false,
                status: 400,
                message: "Overtime has already been submitted for this date"
            })
        })
    })
})