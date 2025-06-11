import auditLogRepository from "../repositories/auditLogRepository.js";
import { runTransaction } from "../../utils/runTransaction.js";
import overtimeRepository from "../repositories/overtimeRepository.js";

class OvertimeService {
  async submitOvertime(hours, submitDate, context) {
    return await runTransaction(async (tx) => {
     
      const isOvertimeSubmitted =
        await overtimeRepository.getOvertimeByEmployeeIdAndDate(
          context.userId,
          submitDate,
          tx
        );
      if (isOvertimeSubmitted) {
        return {
          success: false,
          status: 400,
          message: "Overtime has already been submitted for this date",
        };
      }
      const overtime = await overtimeRepository.submitOvertime(
        {
          employeeId: context.userId,
          overtimeDate: submitDate,
          hours,
          ipAddress: context.ipAddress,
          createdBy: context.userId,
          updatedBy: context.userId,
        },
        tx
      );
      await auditLogRepository.createInsertAuditLog(tx,{
        tableName: "Overtime",
        recordId: overtime.id,
        newData: {
          hours,
          submitDate
        },
        context,
      });
      return {
        success: true,
        status: 201,
        message: "Overtime submitted successfully",
        data: overtime,
      };
    });
  }
}

export default new OvertimeService();
