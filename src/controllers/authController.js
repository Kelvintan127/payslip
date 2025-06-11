import authService from "../services/authService.js";
import jwt from "jsonwebtoken";

class AuthController {
    async adminLogin(req, res) {
        const { username, password } = req.body;
        const result = await authService.validateAdmin(username, password);
        if (!result.success) {
        return res.status(result.status).json(result);
        }
        const token = jwt.sign(
        {   id: result.data.id, 
            name: result.data.name,
            username: result.data.username,
            role: "admin",
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
        );
        res
        .status(result.status)
        .json({
            success: true,
            status: 200,
            message: "Admin logged in successfully",
            data: { token },
        });
    }

    async employeeLogin(req, res) {
        const { username, password } = req.body;
        const result = await authService.validateEmployee(username, password);
        if (!result.success) {
        return res.status(result.status).json(result);
        }
        const token = jwt.sign(
            { id: result.data.id, 
                name: result.data.name,
                username: result.data.username,
                role: "employee",
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
            );
        res
        .status(result.status)
        .json({
            success: true,
            status: 200,
            message: "Employee logged in successfully",
            data: { token },
        });
    }
}

export default new AuthController();
