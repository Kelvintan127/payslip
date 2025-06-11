import {jest} from '@jest/globals';
import overtimeController from '../../../src/controllers/overtimeController.js';
import overtimeService from '../../../src/services/overtimeService.js';

jest.mock('../../../src/services/overtimeService.js');

describe('OvertimeController', () => {
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
        overtimeService.submitOvertime = jest.fn();
        jest.clearAllMocks();
    });

    describe ('submitOvertime', () => {
        it('should return 400 if hours is invalid', async () => {
            req.body = {
                hours: 'invalid',
                submitDate: '2025-07-01',
            };
        });

        it('should return 400 if submitDate is invalid', async () => {
            req.body = {
                hours: 8,
                submitDate: 'invalid-date',
            };
        });

        it('should return 400 if submitDate is in the future', async () => {
            req.body = {
                hours: 8,
                submitDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
            };
            overtimeService.submitOvertime.mockResolvedValue({
                success: false,
                status: 400,
                message: "Overtime cannot be submitted for future dates",
            });
            await overtimeController.submitOvertime(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 400,
                message: "Overtime cannot be submitted for future dates",
            })
        });

        it('should return 400 when submitting for today before 5PM', async () => {
            const now = new Date('2025-07-21T16:00:00.000Z');
            jest.useFakeTimers();
            jest.setSystemTime(now);
        
            req.body = {
                hours: 2,
                submitDate: '2025-07-21', 
            };
        
            overtimeService.submitOvertime.mockResolvedValue({
                success: true,
                status: 200,
                message: 'Overtime submitted successfully',
            });
        
            await overtimeController.submitOvertime(req, res);
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 400,
                message: 'Overtime for today can only be submitted after working hours (after 5PM)',
            });
        
            jest.useRealTimers();
        });   
        
        it('should return 400 if hours is less than or equal to 0', async () => {
            const now = new Date('2025-07-21T10:00:00.000Z');
            jest.useFakeTimers();
            jest.setSystemTime(now);
            req.body = {
                hours: 0,
                submitDate: '2025-07-01',
            };
            overtimeService.submitOvertime.mockResolvedValue({
                success: false,
                status: 400,
                message: "Overtime hours must be greater than 0",
            });
            await overtimeController.submitOvertime(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 400,
                message: "Overtime hours must be greater than 0",
            })
        });

        it('should return 400 if hours is greater than 3', async () => {
            const now = new Date('2025-07-21T10:00:00.000Z');
            jest.useFakeTimers();
            jest.setSystemTime(now);
            req.body = {
                hours: 4,
                submitDate: '2025-07-01',
            }
            overtimeService.submitOvertime.mockResolvedValue({
                success: false,
                status: 400,
                message: "Overtime hours cannot be greater than 3",
            })
            await overtimeController.submitOvertime(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 400,
                message: "Overtime hours cannot be greater than 3",
            });
        });

        it('should return 200 when submitting for the previous day', async () => {
            const now = new Date('2025-07-21T10:00:00.000Z');
            jest.useFakeTimers();
            jest.setSystemTime(now);
        
            req.body = {
                hours: 3,
                submitDate: '2025-07-20',
            };
        
            overtimeService.submitOvertime.mockResolvedValue({
                success: true,
                status: 200,
                message: 'Overtime submitted successfully',
            });
        
            await overtimeController.submitOvertime(req, res);
        
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                status: 200,
                message: 'Overtime submitted successfully',
            });
        
            jest.useRealTimers();
        });
        
        it('should return 500 if the service throws an error on a valid past date', async () => {
            const now = new Date('2025-07-21T10:00:00.000Z');
            jest.useFakeTimers();
            jest.setSystemTime(now);
        
            req.body = {
                hours: 3,
                submitDate: '2025-07-20',
            };
        
            overtimeService.submitOvertime.mockRejectedValue(new Error('Internal error'));
        
            await overtimeController.submitOvertime(req, res);
        
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ 
                success: false,
                status: 500,
                message: 'Internal error' 
            });
        
            jest.useRealTimers();
        });
    });
});