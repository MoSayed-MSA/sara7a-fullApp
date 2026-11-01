import { AppError } from "../../../pkg/error/error.js";

export const OtpExpired = new AppError('Your OTP has beed expired', 409)
export const OtpNotMatch = new AppError('Your OTP not match', 404)

