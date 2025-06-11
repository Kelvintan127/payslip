import payslipService from "../services/payslipService.js";

class payslipController {
    async generatePayslip(req, res) {
        const { payrollId } = req.params;
        const context = req.context;
        if (!payrollId) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Missing required fields",
            });
        }
        const result = await payslipService.generatePayslip(context.userId, parseInt(payrollId));
        return res.status(result.status).json(result);
    }

    async generateSummaryPayslip(req, res) {
        const { payrollId } = req.params;
        if (!payrollId) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Payroll ID is required",
            });
        }
        const result = await payslipService.generateSummaryPayslip(parseInt(payrollId));
        return res.status(result.status).json(result);
    }
}

export default new payslipController();