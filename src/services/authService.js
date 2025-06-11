import AuthRepository from '../repositories/authRepository.js';
import bcrypt from 'bcrypt';

class AuthService {
    async validateAdmin(username, password) {
        const admin = await AuthRepository.getAdminByUsername(username);
        if (!admin) {
            return {
                success: false,
                status: 401,
                message: "Invalid username or password"
            }
        }
        const isValidatedPassword = await bcrypt.compare(password, admin.password);
        if (!isValidatedPassword) {
            return {
                success: false,
                status: 401,
                message: "Invalid username or password"
            }
        }

        return {
            success: true,
            status: 200,
            message: "Admin validated successfully",
        }
    }

    async validateEmployee(username, password) {
        const employee = await AuthRepository.getEmployeeByUsername(username);
        if (!employee) {
            return {
                success: false,
                status: 401,
                message: "Invalid username or password"
            }
        }
        const isValidatedPassword = await bcrypt.compare(password, employee.password);
        if (!isValidatedPassword) {
            return {
                success: false,
                status: 401,
                message: "Invalid username or password"
            }
        }
        return {
            success: true,
            status: 200,
            message: "Employee validated successfully",
        }
    }
}

export default new AuthService();