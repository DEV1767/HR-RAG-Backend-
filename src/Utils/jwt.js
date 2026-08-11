import jwt from "jsonwebtoken";

export const generateAccessToken = (employee) => {
    return jwt.sign(
        {
            id: employee._id.toString(),
            employeeId: employee.employeeId,
            role: employee.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
        }
    );
};

export const generateRefreshToken = (employee) => {
    return jwt.sign(
        {
            id: employee._id.toString(),
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
        }
    );
};