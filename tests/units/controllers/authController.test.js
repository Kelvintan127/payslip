import AuthController from '../../../src/controllers/authController.js';
import authService from '../../../src/services/authService.js';
import jwt from 'jsonwebtoken';
import {jest} from '@jest/globals';

jest.mock('../../../src/services/authService.js');

describe('AuthController', () => {
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
    
        authService.validateAdmin = jest.fn();
        authService.validateEmployee = jest.fn();
    
        jest.spyOn(jwt, 'sign').mockImplementation(() => 'mocked-jwt-token');
    
        jest.clearAllMocks();
    });
    

    describe('adminLogin', () => {
        it('should return token when admin login is successful', async () => {
            req.body = { username: 'admin', password: 'password' };

            authService.validateAdmin.mockResolvedValue({
                success: true,
                status: 200,
                data: { id: 1, name: 'Admin User', username: 'admin' },
            });

            await AuthController.adminLogin(req, res);

            expect(authService.validateAdmin).toHaveBeenCalledWith('admin', 'password');
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 1, name: 'Admin User', username: 'admin', role: 'admin' },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                status: 200,
                message: 'Admin logged in successfully',
                data: { token: 'mocked-jwt-token' },
            });
        });

        it('should return error if admin login fails', async () => {
            req.body = { username: 'admin', password: 'wrongpass' };

            authService.validateAdmin.mockResolvedValue({
                success: false,
                status: 401,
                message: 'Invalid credentials',
            });

            await AuthController.adminLogin(req, res);

            expect(authService.validateAdmin).toHaveBeenCalledWith('admin', 'wrongpass');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 401,
                message: 'Invalid credentials',
            });
        });
    });

    describe('employeeLogin', () => {
        it('should return token when employee login is successful', async () => {
            req.body = { username: 'employee', password: 'password' };

            authService.validateEmployee.mockResolvedValue({
                success: true,
                status: 200,
                data: { id: 101, name: 'Employee User', username: 'employee' },
            });

            await AuthController.employeeLogin(req, res);

            expect(authService.validateEmployee).toHaveBeenCalledWith('employee', 'password');
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 101, name: 'Employee User', username: 'employee', role: 'employee' },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                status: 200,
                message: 'Employee logged in successfully',
                data: { token: 'mocked-jwt-token' },
            });
        });

        it('should return error if employee login fails', async () => {
            req.body = { username: 'employee', password: 'wrongpass' };

            authService.validateEmployee.mockResolvedValue({
                success: false,
                status: 401,
                message: 'Invalid credentials',
            });

            await AuthController.employeeLogin(req, res);

            expect(authService.validateEmployee).toHaveBeenCalledWith('employee', 'wrongpass');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 401,
                message: 'Invalid credentials',
            });
        });
    });
});
