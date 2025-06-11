import {jest} from "@jest/globals";
import auditLogRepository from "../../../src/repositories/auditLogRepository.js";

describe("AuditLogRepository", () => {
  const tx = {
    auditLog: {
      create: jest.fn(),
    },
  };

  const context = {
    userId: 1,
    username: "john.doe",
    ipAddress: "127.0.0.1",
    requestId: "req-123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createInsertAuditLog", () => {
    it("should create an insert audit log", async () => {
      const input = {
        tableName: "User",
        recordId: 1,
        newData: { name: "John" },
        context,
      };

      const expected = {
        id: 1,
        ...input,
        action: "INSERT",
      };

      tx.auditLog.create.mockResolvedValueOnce(expected);

      const result = await auditLogRepository.createInsertAuditLog(tx, input);

      expect(tx.auditLog.create).toHaveBeenCalledWith({
        data: {
          tableName: input.tableName,
          recordId: input.recordId,
          action: "INSERT",
          changes: input.newData,
          createdBy: context.userId,
          createdByName: context.username,
          ipAddress: context.ipAddress,
          requestId: context.requestId,
        },
      });

      expect(result).toEqual(expected);
    });
  });

  describe("createUpdateAuditLog", () => {
    it("should create an update audit log", async () => {
      const input = {
        tableName: "User",
        recordId: 1,
        oldData: { name: "John" },
        newData: { name: "Johnny" },
        context,
      };

      const expected = {
        id: 2,
        ...input,
        action: "UPDATE",
      };

      tx.auditLog.create.mockResolvedValueOnce(expected);

      const result = await auditLogRepository.createUpdateAuditLog(tx, input);

      expect(tx.auditLog.create).toHaveBeenCalledWith({
        data: {
          tableName: input.tableName,
          recordId: input.recordId,
          action: "UPDATE",
          changes: {
            oldData: input.oldData,
            newData: input.newData,
          },
          createdBy: context.userId,
          createdByName: context.username,
          ipAddress: context.ipAddress,
          requestId: context.requestId,
        },
      });

      expect(result).toEqual(expected);
    });
  });
});
