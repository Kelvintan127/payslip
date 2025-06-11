import {jest} from "@jest/globals";
import payslipController from "../../../src/controllers/payslipController.js";
import payslipService from "../../../src/services/payslipService.js";

jest.mock("../../../src/services/payslipService.js");
describe("PayslipController", () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),    
        }
        payslipService.generatePayslip = jest.fn();
        payslipService.generateSummaryPayslip = jest.fn();
        jest.clearAllMocks();
    })
    describe("generatePayslip", () => {
        it("should return 400 if payrollId is not provided", async () => {
            req.params = {
                payrollId: null,
            };
            await payslipController.generatePayslip(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 400,
                message: "Missing required fields",
            });
        });
        
        it("should return 200 if payrollId is provided", async () => {
            req.params = {
                payrollId: 1,
            };

            const context = {
                user: {
                  id: 1,
                  ipAddress: "127.0.0.1"
                },
              }
            req.context = context;

            payslipService.generatePayslip.mockResolvedValue({
                success: true,
                status: 200,
                message: "Payslip generated successfully",
            });

            await payslipController.generatePayslip(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                status: 200,
                message: "Payslip generated successfully",
            });
        });
        jest.clearAllMocks();
    });

    describe("generateSummaryPaySlip", () => {
        it("should return 400 if payrollId is not provided", async () => {
            req.params = {
                payrollId: null,
            }
            await payslipController.generateSummaryPayslip(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 400,
                message: "Payroll ID is required",
            });
        });
        it("should return 200 if payrollId is provided", async () => {
            req.params = {
                payrollId: 1,
            };
            const context = {
                user: {
                  id: 1,
                  ipAddress: "127.0.0.1"
                },
              }
            req.context = context;

            payslipService.generateSummaryPayslip.mockResolvedValue({
                success: true,
                status: 200,
                message: "Payslip generated successfully",
            });

            await payslipController.generateSummaryPayslip(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                status: 200,
                message: "Payslip generated successfully",
            });
        });
    });
})