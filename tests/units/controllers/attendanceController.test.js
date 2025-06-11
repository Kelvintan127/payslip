import { jest } from '@jest/globals';
import AttendanceController from '../../../src/controllers/attendanceController.js';
import attendanceService from '../../../src/services/attendanceService.js';

jest.mock('../../../src/services/attendanceService.js');

describe('AttendanceController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      context: { userId: 1, ipAddress: '127.0.0.1' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    attendanceService.createAttendancePeriod = jest.fn();
    attendanceService.submitAttendance = jest.fn();
    jest.clearAllMocks();
  });

  describe('createAttendancePeriod', () => {
    it('should return 400 if start or end date is invalid', async () => {
      req.body = { startDate: 'invalid', endDate: 'invalid' };

      await AttendanceController.createAttendancePeriod(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Start date and end date are required',
      });
    });

    it('should return 400 if start date is after end date', async () => {
      req.body = {
        startDate: '2025-07-10',
        endDate: '2025-07-05',
      };

      await AttendanceController.createAttendancePeriod(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Start date must be before end date',
      });
    });

    it('should return 200 if createAttendancePeriod is successful', async () => {
      req.body = {
        startDate: '2025-07-01',
        endDate: '2025-07-05',
      };

      attendanceService.createAttendancePeriod.mockResolvedValue({
        success: true,
        status: 200,
        message: 'Attendance period created successfully',
        data: {},
      });

      await AttendanceController.createAttendancePeriod(req, res);

      expect(attendanceService.createAttendancePeriod).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 200,
        message: 'Attendance period created successfully',
        data: {},
      });
    });

    it('should return 500 if createAttendancePeriod throws error', async () => {
      req.body = {
        startDate: '2025-07-01',
        endDate: '2025-07-05',
      };

      attendanceService.createAttendancePeriod.mockRejectedValue(new Error('Internal error'));

      await AttendanceController.createAttendancePeriod(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal error',
      });
    });
  });

  describe('submitAttendance', () => {
    it('should return 400 if attendance date is invalid', async () => {
      req.body = { attendanceDate: 'invalid-date' };

      await AttendanceController.submitAttendance(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Attendance date is required',
      });
    });

    it('should return 200 if attendance is submitted successfully', async () => {
      req.body = { attendanceDate: '2025-06-10' };

      attendanceService.submitAttendance.mockResolvedValue({
        success: true,
        status: 200,
        message: 'Attendance submitted',
      });

      await AttendanceController.submitAttendance(req, res);

      expect(attendanceService.submitAttendance).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 200,
        message: 'Attendance submitted',
      });
    });

    it('should return 500 if attendance service throws error', async () => {
      req.body = { attendanceDate: '2025-06-10' };

      attendanceService.submitAttendance.mockRejectedValue(new Error('Submit error'));

      await AttendanceController.submitAttendance(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Submit error' });
    });
  });
});
