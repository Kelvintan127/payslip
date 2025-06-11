import {jest} from "@jest/globals";
import payrollController from "../../../src/controllers/payrollController.js";
import payrollService from "../../../src/services/payrollService.js";

jest.mock("../../../src/services/payrollService.js");
describe("PayrollController", () => {
  let req;
  let res;
  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    payrollService.runPayroll = jest.fn();
    jest.clearAllMocks();
  })
  
  describe("runPayroll", () => {
    it("should return 400 if attendancePeriodId is not provided", async () => {
      await payrollController.runPayroll(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "attendance Period ID is required",
      });
    });
    it("should return 200 if attendancePeriodId is provided", async () => {
      req.body = {
        attendancePeriodId: 1,
      };
      const context = {
        user: {
          id: 1,
          ipAddress: "127.0.0.1"
        },
      };
      req.context = context;
      payrollService.runPayroll.mockResolvedValue({
        status: 200,
        message: "Payroll run successfully",
      })
      await payrollController.runPayroll(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Payroll run successfully",
      });
    });
    it("should return 500 if attendancePeriodId is provided", async () => {
      req.body = {
        attendancePeriodId: 1,
      };
      const context = {
        user: {
          id: 1,
          ipAddress: "127.0.0.1"
        },
      }
      req.context = context;
      payrollService.runPayroll.mockRejectedValue({
        status: 500,
        message: "Internal Server Error",
      })
      await payrollController.runPayroll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      })
    });
  })
});