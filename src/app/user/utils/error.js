import { AppError } from "../../../pkg/error/error.js";

export const userExist = new AppError('user already exist', 409)
export const userNotExist = new AppError('user is not exist', 404)
export const userVerified = new AppError('You are already verified', 400)
export const userNotVerified = new AppError('You are not verified yet', 400)
export const userNotSignUp = new AppError('You need to sign up first', 400)