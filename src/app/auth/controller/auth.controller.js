import { successResponse } from "../../../pkg/utils/successRes.js";
import { timeToMS } from "../../../pkg/utils/time.js";
import { validateBody } from "../../../lib/validation/validation.js";
import { forgetPassDto, loginDto, registerDto, sendOtpDto, verifyOtpDto } from "../dto/auth.dto.js";
import * as authService from "../service/auth.service.js";

export async function register(req, res, next) {
    try {
        const { name, email, password } = validateBody(registerDto, req.body);

        const createdUser = await authService.register({ name, email, password });
        successResponse(res, 201, "User registered successfully", createdUser);
    } catch (error) {
        next(error);
    }
}

export async function verifyOtp(req, res, next) {
    try {
        const { email, otp } = validateBody(verifyOtpDto, req.body);

        const user = await authService.verifyOTP(email, otp);
        successResponse(res, 200, "User verified successfully", user);
    } catch (error) {
        next(error);
    }
}

export async function signIn(req, res, next) {
    try {
        const { email, password } = validateBody(loginDto, req.body);

        const { accessToken, refreshToken } = await authService.login(email, password);

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: timeToMS(15, 'm')
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: timeToMS(7, 'd')
        });

        successResponse(res, 200, "User logged in successfully");
    } catch (error) {
        next(error);
    }
}

export async function refresh(req, res, next) {
    try {
        const incomingRefreshToken = req.cookies?.refresh_token;
        const newAccessToken = await authService.refreshAccessToken(incomingRefreshToken);

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            maxAge: timeToMS(15, 'm')
        });

        successResponse(res, 200, "Token refreshed successfully");
    } catch (error) {
        next(error);
    }
}

export async function sendOtp(req, res, next) {
    try {
        const { email } = validateBody(sendOtpDto, req.body);

        await authService.send0tp(email);
        successResponse(res, 200, "OTP sent successfully");

    } catch (err) {
        next(err);
    }
}

export async function forgetPassword(req, res, next) {
    try {
        const { email, code, newPassword } = validateBody(forgetPassDto, req.body);

        await authService.forgetPassword(email, code, newPassword);
        successResponse(res, 200, "Password reset successfully");
    } catch (error) {
        next(error);
    }
}

export async function loginWithGoogle(req, res, next) {
    try {
        const { idToken } = req.body;
        const { accessToken, refreshToken } = await authService.loginWithGoogle(idToken);

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: timeToMS(15, 'm')
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: timeToMS(7, 'd')
        });

        successResponse(res, 200, "Google login successful");
    } catch (err) {
        next(err);
    }
}

export async function logout(req, res, next) {
    try {
        //logging out simply clears the cookies on the client side
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        successResponse(res, 200, "Logged out successfully");
    } catch (error) {
        next(error);
    }
}

export async function getAllUsers(req, res, next) {
    try {
        const users = await authService.getAllUsers();
        successResponse(res, 200, "Users retrieved successfully", users);
    } catch (error) {
        next(error);
    }
}
export async function uploadProfilePic(req, res, next) {
    try {
        const user = req.user
        const filePath = req.file.path
        await authService.ProfilePic(user, filePath)
        successResponse(res, 200, "Uploaded file successfully");
    } catch (error) {
        next(error);
    }
}
