import { ApError } from "../../../pkg/error/error.js";

export const OtpExpired = new ApError('Your OTP has beed expired', 409)
export const OtpNotMatch = new ApError('Your OTP not match', 404)

