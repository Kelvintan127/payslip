import prisma from "../../utils/prisma.js";

class AuthRepository {
    async getAdminByUsername(username) {
        const admin = await prisma.admin.findUnique({
            where: {username,
                deletedAt: null,
            },
        });
        return admin;
    }

    async getEmployeeByUsername(username) {
        const employee = await prisma.employee.findUnique({
            where: {username,
                deletedAt: null,
            },
        });
        return employee;
    }
}

export default new AuthRepository();