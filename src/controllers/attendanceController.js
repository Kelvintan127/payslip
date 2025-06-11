import attendanceService from "../services/attendanceService.js";

class AttendanceController {
  async createAttendancePeriod(req, res) {
    try {
      const { startDate, endDate } = req.body;
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const context = req.context;

      if (isNaN(start) || isNaN(end)) {
        return res
          .status(400)
          .json({ message: "Start date and end date are required" });
      }
      if (start >= end) {
        return res
          .status(400)
          .json({ message: "Start date must be before end date" });
      }

      const attendance = await attendanceService.createAttendancePeriod(
        start,
        end,
        context
      );
      res.status(attendance.status).json(attendance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

    async submitAttendance(req, res) {
        try {
        const { attendanceDate } = req.body;
        const context = req.context;
        const date = new Date(attendanceDate);
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (isNaN(date)) {
            return res.status(400).json({ message: "Attendance date is required" });
        }

        const attendance = await attendanceService.submitAttendance(
            date,
            context
        );

        res.status(attendance.status).json(attendance);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }
}

export default new AttendanceController();
