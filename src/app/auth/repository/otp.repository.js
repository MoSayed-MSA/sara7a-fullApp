import OTP from '../model/otp.model.js'

export async function createOTP(otpData) {
    return OTP.create(otpData);
}

export async function findOtpByEmail(email) {
    return OTP.findOne({ email })
}

export async function deleteOTP(email) {
    return OTP.deleteMany({email})
}