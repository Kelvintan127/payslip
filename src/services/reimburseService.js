import { runTransaction } from "../../utils/runTransaction.js";
import auditLogRepository from "../repositories/auditLogRepository.js";
import reimburseRepository from "../repositories/reimburseRepository.js";

class ReimburseService {
  async submitReimburse({amount, description, date}, context) {
    return await runTransaction(async (tx) => {
      const reimburse = await reimburseRepository.submitReimburse(
        {
          amount: amount,
          reimbursementDate: date,
          description: description,
          employeeId: context.userId,
          ipAddress: context.ipAddress,
          createdBy: context.userId,
          updatedBy: context.userId,
        },
        tx
      );

      if (!reimburse) {
        return {
          success: false,
          status: 400,
          message: "Reimburse submission failed",
        };
      }

      await auditLogRepository.createInsertAuditLog(tx, {
        tableName: "Reimbursement",
        recordId: reimburse.id,
        newData: {
          amount,
          description,
          date,
        },
        context,
      });

      return {
        success: true,
        status: 200,
        message: "Reimburse submitted successfully",
        data: reimburse,
      };
    });
  }
}

export default new ReimburseService();
