import { ApError } from "../../../pkg/error/error.js";

export const userExist = new ApError('user already exist', 409)
export const userNotExist = new ApError('user is not exist', 404)
export const userVerified = new ApError('You are already verified', 400)
export const userNotVerified = new ApError('You are not verified yet', 400)
export const userNotSignUp = new ApError('You need to sign up first', 400)