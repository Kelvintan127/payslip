import overtimeService from "../services/overtimeService.js";

class OvertimeController {
  async submitOvertime(req, res) {
    try {
      const context = req.context;
      const { hours, submitDate } = req.body;
      const date = new Date(submitDate);
      const hour = parseFloat(hours);

      const now = new Date();

      const submitYear = date.getFullYear();
      const submitMonth = date.getMonth();
      const submitDay = date.getDate();

      const todayYear = now.getFullYear();
      const todayMonth = now.getMonth();
      const todayDay = now.getDate();

      const isFutureDate =
        submitYear > todayYear ||
        (submitYear === todayYear && submitMonth > todayMonth) ||
        (submitYear === todayYear &&
          submitMonth === todayMonth &&
          submitDay > todayDay);

      if (isFutureDate) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Overtime cannot be submitted for future dates",
        });
      }

      const isToday =
        submitYear === todayYear &&
        submitMonth === todayMonth &&
        submitDay === todayDay;

      if (isToday) {
        const currentHour = now.getUTCHours();
        if (currentHour < 17) {
          return res.status(400).json({
            success: false,
            status: 400,
            message:
              "Overtime for today can only be submitted after working hours (after 5PM)",
          });
        }
      }

      if (hour <= 0) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Overtime hours must be greater than 0",
        });
      }

      if (hour > 3) {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Overtime hours cannot be greater than 3",
        });
      }

      const overtime = await overtimeService.submitOvertime(
        hour,
        date,
        context
      );
      return res.status(overtime.status).json(overtime);
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: error.message,
      });
    }
  }
}

export default new OvertimeController();
