class AuditLogRepository {
    async createInsertAuditLog(tx, {tableName, recordId, newData, context}) {
        return await tx.auditLog.create({
        data: {
            tableName,
            recordId,
            action: 'INSERT',
            changes: newData,
            createdBy: context.userId,
            createdByName: context.username,
            ipAddress: context.ipAddress,
            requestId: context.requestId,
        },
        });
    }

    async createUpdateAuditLog(tx, {tableName, recordId, oldData, newData, context}) {
        return await tx.auditLog.create({
        data: {
            tableName,
            recordId,
            action: 'UPDATE',
            changes: {
            oldData,
            newData,
            },
            createdBy: context.userId,
            createdByName: context.username,
            ipAddress: context.ipAddress,
            requestId: context.requestId,
        },
        });
    }
}

export default new AuditLogRepository();
