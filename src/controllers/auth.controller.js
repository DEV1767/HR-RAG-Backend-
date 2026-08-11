import bcrypt from "bcrypt";
import Company from "../models/Company.js";
import Employee from "../models/Employee.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/jwt.js";

export const registerEmployee = async (req, res) => {
    try {
        const { employeeId, name, email, password } = req.body;

       
        if (!employeeId || !name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Employee ID, name, email and password are required",
            });
        }

      
        const company = await Company.findOne();

        if (!company) {
            return res.status(500).json({
                success: false,
                message: "Company information not configured",
            });
        }

     
        const isAuthorizedEmployee =
            company.employeeIds.includes(employeeId);

        if (!isAuthorizedEmployee) {
            return res.status(403).json({
                success: false,
                message: "You are not an authorized employee",
            });
        }

   
        const existingEmployee = await Employee.findOne({
            $or: [{ employeeId }, { email }],
        });

        if (existingEmployee) {
            return res.status(409).json({
                success: false,
                message: "Employee is already registered",
            });
        }

        
        const hashedPassword = await bcrypt.hash(password, 12);

       
        const employee = await Employee.create({
            employeeId,
            name,
            email,
            password: hashedPassword,
        });

       
        return res.status(201).json({
            success: true,
            message: "Employee registered successfully",
            data: {
                id: employee._id,
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email,

            },
        });

    } catch (error) {
        console.error("Register employee error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // 2. Find employee
        // password has select:false, so explicitly request it
        const employee = await Employee.findOne({ email }).select("+password");

        if (!employee) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 3. Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            employee.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 4. Generate tokens
        const accessToken = generateAccessToken(employee);
        const refreshToken = generateRefreshToken(employee);

        // 5. Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                employee: {
                    id: employee._id,
                    employeeId: employee.employeeId,
                    name: employee.name,
                    email: employee.email,
                   
                },
                accessToken,
                refreshToken,
            },
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const employee = await Employee.findById(req.employee.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: employee._id,
                employeeId: employee.employeeId,
                name: employee.name,
                email: employee.email,
                role: employee.role,
            },
        });

    } catch (error) {
        console.error("Get me error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required",
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const employee = await Employee.findById(decoded.id);

        if (!employee) {
            return res.status(401).json({
                success: false,
                message: "Employee not found",
            });
        }

        const newAccessToken = generateAccessToken(employee);

        return res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: {
                accessToken: newAccessToken,
            },
        });

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Refresh token has expired. Please login again.",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        console.error("Refresh token error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const logoutEmployee = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};