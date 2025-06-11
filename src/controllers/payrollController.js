import payrollService from "../services/payrollService.js";

class PayrollController {
    async runPayroll(req, res) {
        try {
            const {attendancePeriodId} = req.body;
            const context = req.context;
            if (!attendancePeriodId) {
                return res.status(400).json({
                    message: "attendance Period ID is required"
                });
            }

            

            const payroll = await payrollService.runPayroll(attendancePeriodId, context);
            return res.status(payroll.status).json(payroll);
        }
        catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }
}
export default new PayrollController();