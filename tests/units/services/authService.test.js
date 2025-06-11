import {jest} from '@jest/globals';
import AuthService from '../../../src/services/authService.js';
import AuthRepository from '../../../src/repositories/authRepository.js';
import bcrypt from 'bcrypt';

jest.mock('../../../src/repositories/authRepository.js');
jest.mock('bcrypt');
describe('AuthService', () => {
    const context = {
        userId: 1,
        ipAddress: "IP_ADDRESS"
    }
    beforeEach(() => {
        AuthRepository.getAdminByUsername = jest.fn();
        AuthRepository.getEmployeeByUsername = jest.fn();
        bcrypt.compare = jest.fn();
        jest.clearAllMocks();
    })
    describe('validateAdmin', () => {
        it('should return true if admin is valid', async () => {
            const mockAdmin = {
                id: 1,
                username: 'admin',
                password: 'hashedPassword',
                role: 'admin'
            }
            AuthRepository.getAdminByUsername.mockResolvedValue(mockAdmin);
            bcrypt.compare.mockResolvedValue(true);
            const result = await AuthService.validateAdmin('admin', 'password');
            expect(result).toEqual({
                success: true,
                status: 200,
                message: "Admin validated successfully"
            });
        })

        it('should return false if admin is not valid', async () => {
            AuthRepository.getAdminByUsername.mockResolvedValue(null);
            const result = await AuthService.validateAdmin('admin', 'password');
            expect(result).toEqual({
                success: false,
                status: 401,
                message: "Invalid username or password"
            });
        });

        it('should return false if password is not valid', async () => {
            const mockAdmin = {
                id: 1,
                username: 'admin',
                password: 'hashedPassword',
                role: 'admin'
            }
            AuthRepository.getAdminByUsername.mockResolvedValue(mockAdmin);
            bcrypt.compare.mockResolvedValue(false);
            const result = await AuthService.validateAdmin('admin', 'password');
            expect(result).toEqual({
                success: false,
                status: 401,
                message: "Invalid username or password"
            });
        })
    });

    describe('validateEmployee', () => {
        it('should return true if employee is valid', async () => {
            const mockEmployee = {
                id: 1,
                username: 'employee',
                password: 'hashedPassword',
                role: 'employee'
            }
            AuthRepository.getEmployeeByUsername.mockResolvedValue(mockEmployee);
            bcrypt.compare.mockResolvedValue(true);
            const result = await AuthService.validateEmployee('employee', 'password');
            expect(result).toEqual({
                success: true,
                status: 200,
                message: "Employee validated successfully"
            });
        });
        it('should return false if employee is not valid', async () => {
            AuthRepository.getEmployeeByUsername.mockResolvedValue(null);
            const result = await AuthService.validateEmployee('employee', 'password');
            expect(result).toEqual({
                success: false,
                status: 401,
                message: "Invalid username or password"
            }); 
        });
        it('should return false if password is not valid', async () => {
            const mockEmployee = {
                id: 1,
                username: 'employee',
                password: 'hashedPassword',
                role: 'employee'
            }
            AuthRepository.getEmployeeByUsername.mockResolvedValue(mockEmployee);
            bcrypt.compare.mockResolvedValue(false);
            const result = await AuthService.validateEmployee('employee', 'password');
            expect(result).toEqual({
                success: false,
                status: 401,
                message: "Invalid username or password"
            });
        });
    })
})