import { z } from 'zod'

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/
const codeRegex = /^\d+$/

export const registerDto = z.object({
    email: z.email().trim().toLowerCase(),
    name: z.string().trim().toLowerCase().min(2).max(8),
    password: z.string().min(8).max(16).trim().regex(passwordRegex, { message: "Password must contain at least 1 uppercase letter and 1 special character" })
})

export const loginDto = z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8).max(16).trim()
})

export const forgetPassDto = z.object({
    email: z.email().trim().toLowerCase(),
    code: z.string().length(6).regex(codeRegex),
    newPassword: z.string().min(8).max(16).trim().regex(passwordRegex)
})

export const verifyOtpDto = z.object({
    otp: z.string().length(6).regex(codeRegex),
    email: z.email().trim().toLowerCase(),
})

export const sendOtpDto = z.object({
    email: z.email().trim().toLowerCase(),
})
