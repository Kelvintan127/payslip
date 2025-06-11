import reimburseService from "../services/reimburseService.js";

class ReimburseController {
    async submitReimburse(req, res) {
        try {
            const { amount, reimburseDate, description } = req.body;
            const context = req.context;
            const date = new Date(reimburseDate);

            if (!amount || !description || !reimburseDate) {
                return res.status(400).json({
                success: false,
                status: 400,
                message: "All fields are required",
                });
            }
            const reimburse = await reimburseService.submitReimburse(
                {amount,
                description,
                date},
                context
            );
            return res.status(reimburse.status).json(reimburse);
        } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message,
        });
        }
    }
}

export default new ReimburseController();
