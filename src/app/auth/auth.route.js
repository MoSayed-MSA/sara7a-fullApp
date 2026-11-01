import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import * as authController from './controller/auth.controller.js';
import { withCache } from '../../lib/cache/withCashe.middleware.js';
import { idempotency } from '../../lib/idempotency/idempotency.js';
import { uploadSingleFile } from '../../pkg/media/multer.js';
import { guard } from '../../lib/middleware/guard.js';
import { timeToMS } from '../../pkg/utils/time.js';
import { AppError } from '../../pkg/error/error.js';

const authRouter = Router();

const authLimiter = rateLimit({
    windowMs: timeToMS(5, 'min'),
    max: 5,
    standardHeaders: 'draft-7',
    handler: function (req, res, next) {
        next(new AppError('Too many requests, please try again later.', 429));
    }
});

authRouter.post('/register', authController.register);
authRouter.post('/login-with-google', authController.loginWithGoogle);
authRouter.post('/login-with-code', authController.verifyCodeToLogin);

authRouter.post('/signin', authLimiter, authController.login);
authRouter.patch('/verify', authLimiter, authController.verifyOtp);
authRouter.post('/send-otp', authLimiter, authController.sendOtp);
authRouter.patch('/reset-pass', authLimiter, idempotency(), authController.forgetPassword);

authRouter.post('/logout', guard, authController.logout);
authRouter.get('/users', withCache(60), authController.getAllUsers);
authRouter.post('/upload-profile-pic', guard, uploadSingleFile('file'), authController.uploadProfilePic);
authRouter.post('/refresh-token', authController.refresh);
authRouter.post('/enable-two-step', guard, authController.enableTwoStepVeification);

export default authRouter;