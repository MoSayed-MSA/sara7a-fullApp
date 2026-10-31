import * as authRepo from "../repository/auth.repository.js";
import * as otpRepo from "../repository/otp.repository.js";
import { timeToMS } from "../../../pkg/utils/time.js";
import { sendEmail } from "../../../lib/email/email.js";
import { generate0TPCode } from "../../../pkg/utils/otps.js";
import { ApError } from "../../../pkg/error/error.js";
import { userExist, userNotExist, userNotSignUp, userNotVerified, userVerified } from "../../user/utils/error.js";
import { generateRefreshToken, generateToken } from "../../../lib/security/jwt.js";
import { comparePassword, hashPassword } from "../../../lib/security/bcrypt.js";
import { OtpExpired, OtpNotMatch } from "../utils/error.js";
import { logger } from "../../../pkg/logger/logger.js";
import { verifyGoogleAccount } from "../../../lib/utils/google-Oauth.js";
import fs from 'node:fs'
import { cacheProvider } from "../../../lib/cache/init.js";


export async function register(userData) {
    // check if user already exists
    const user = await authRepo.findUserByEmail(userData.email);

    // if user exists, throw error
    if (user) {
        throw userExist
    }

    // hash password
    userData.password = await hashPassword(userData.password)

    // create user
    const createdUser = await authRepo.createUser(userData);

    // create OTP for email verification
    const otp = await generate0TPCode()

    //set otp in cache for 5 minutes
    await cacheProvider.set(`OTP:${userData.email}`, otp, timeToMS(5, 'min'));

    //verify OTP from email 
    await sendEmail(userData.email, "Verify your email", `<p>Your OTP is: <h1>${otp}</h1></p>`);

    return createdUser;
}

export async function verify2StepOTP(email, code) {
    // check user exist
    const userExisting = await authRepo.findUserByEmail(email)
    if (!userExisting) {
        throw userNotExist
    }

    //check if user verified
    if (userExisting.isVerified === false) {
        throw userNotVerified
    }

    //check OTP exist
    const cachedOtp = await cacheProvider.get(`OTP:${email}`);
    if (!cachedOtp) {
        throw OtpExpired
    }


    if (cachedOtp !== code) {
        throw OtpNotMatch;
    }

    // make user verified
    if (code = cachedOtp) {
        await authRepo.updateUserStatus(email, userExisting.isVerified = true)
    }

    //delete used otp
    await cacheProvider.del(`OTP:${email}`);

    //generate JWT token
    const payload = {
        userId: userExisting._id,
        email: userExisting.email
    };
    const accessToken = await generateToken(payload, '1h')
    const refreshToken = generateRefreshToken(payload, '7d');

    return { accessToken, refreshToken }

}

export async function verifyOTP(email, otp) {
    // check user exist
    const userExisting = await authRepo.findUserByEmail(email)
    if (!userExisting) {
        throw userNotExist
    }

    //check if user verified
    if (userExisting.isVerified === true) {
        throw userVerified
    }

    //check OTP exist
    const cachedOtp = await cacheProvider.get(`OTP:${email}`);
    if (!cachedOtp) {
        throw userNotSignUp
    }

    if (cachedOtp !== otp) {
        throw OtpNotMatch;
    }

    // make user verified
    if (otp = cachedOtp) {
        await authRepo.updateUserStatus(userExisting.email, userExisting.isVerified = true)
    }

    // notify user of his verificatin
    await sendEmail(userExisting.email,
        "verificaton completed",
        `<h2>Your accout has been Verified Successfully</h2> <br> <p>Now you can login welcome to our community, ENJOY❤️</p>`
    );

    //delete used otp
    await cacheProvider.del(`OTP:${email}`);

    return userExisting

}

export async function enable2StepVeification(email, otp) {
    // check user exist
    const userExisting = await authRepo.findUserByEmail(email)
    if (!userExisting) {
        throw userNotExist
    }

    //check OTP exist
    const cachedOtp = await cacheProvider.get(`OTP:${email}`);
    if (!cachedOtp) {
        throw OtpExpired
    }

    if (cachedOtp !== otp) {
        throw OtpNotMatch;
    }

    // enable 2 step 
    if (otp = cachedOtp) {
        await authRepo.updateUserByEmail(email, { twoStepVerification: true })
    }

    //delete used otp
    await cacheProvider.del(`OTP:${email}`);
}

export async function login(email, password) {

    //check if user exist and ferified
    const user = await authRepo.findUserByEmail(email)
    if (!user) {
        throw userNotExist
    }

    if (user.isVerified == false) {
        throw userNotVerified
    }

    //check pasword
    const checkPass = await comparePassword(password, user.password)
    if (!checkPass) {
        throw new ApError("password is not correct", 400)
    }

    //check two step verification
    if (user.twoStepVerification === true) {
        const code = generate0TPCode();

        await cacheProvider.set(`OTP:${email}`, code, 180);

        await sendEmail(email, '2 step verification email code', `<h3> Your OTP to Login is ${code}</h3>`);

        return
    }

    //generate JWT token
    const payload = {
        userId: user._id,
        email: user.email
    };
    const accessToken = await generateToken(payload, '1h')
    const refreshToken = generateRefreshToken(payload, '7d');

    return { accessToken, refreshToken }

}

export async function refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
        throw new ApError("Refresh token missing", 401);
    }

    try {
        // Verify signature and expiration using the refresh secret
        const decoded = verifyRefreshToken(incomingRefreshToken);

        // Optional: Check if user still exists and isn't deleted
        const user = await authRepo.findUserByEmail(decoded.email);
        if (!user || user.isDeleted) {
            throw new ApError("User no longer exists", 403);
        }

        const payload = {
            userId: user._id,
            email: user.email
        };

        const newAccessToken = generateAccessToken(payload, '1h');
        return newAccessToken;

    } catch (error) {
        throw new ApError("Invalid or expired refresh token", 403);
    }
}

export async function send0tp(email) {
    // 1. check user existence
    const user = await authRepo.findUserByEmail(email);// {} | null
    if (!user) throw userNotExist

    // delete old OTPs
    await cacheProvider.del(`OTP:${user.email}`)

    // 2. generate OTP and save it into DB
    const code = await generate0TPCode();

    await cacheProvider.set(`OTP:${user.email}`, code, timeToMS(5, 'min'))

    // 3. send otp email
    await sendEmail(user.email, "Verify your email", `<p>Your OTP is: <h1>${code}</h1></p>`);

}

export async function forgetPassword(email, code, newPassword) {
    // 1. check OTP
    const cachedOtp = await cacheProvider.get(`OTP:${email}`);
    if (!cachedOtp) throw OtpExpired;
    if (cachedOtp !== code) throw OtpNotMatch;

    // 2. update user password
    const hashPass = await hashPassword(newPassword)
    await authRepo.updateUserByEmail(email, { password: hashPass })

    //3. delete OTPs 
    await cacheProvider.del(`OTP:${email}`);
}

export async function loginWithGoogle(idToken) {
    // verify google account
    const payload = await verifyGoogleAccount(idToken)
    //check user existance
    const user = await authRepo.findUserByEmail(payload.email)
    // if user not exist, create token and return
    if (!user) {
        return generateToken({ email: payload.email, id: user._id })
    }
    // if user not exist create new user with token
    const new_user = await authRepo.createUser({
        name: payload.name,
        email: payload.email,
        proiver: 'Google',
        isVerified: true
    })
    const token = generateToken({ email: new_user.email, id: new_user._id })
    const refreshToken = generateRefreshToken({ email: new_user.email, id: new_user._id }, '7d')

    return { token, refreshToken }
}

export async function getAllUsers() {
    const users = await authRepo.getAllUsers()
    return users
}

export async function ProfilePic(user, path) {
    if (user.profilePic) {
        try {
            fs.unlinkSync(user.profilePic);
        } catch (e) {

        }
    }

    await authRepo.updateUserByEmail(user.email, { profilePic: path });
}