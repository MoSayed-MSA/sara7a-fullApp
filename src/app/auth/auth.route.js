import { Router } from 'express';
import * as authController from './controller/auth.controller.js';
import { withCache } from '../../lib/cache/withCashe.middleware.js';
import { idempotency } from '../../lib/idempotency/idempotency.js';
import { uploadSingleFile } from '../../pkg/media/multer.js';
import { fileValidation } from '../../pkg/media/file.validation.js';
import { guard } from '../../lib/middleware/guard.js'

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.patch('/verify', authController.verifyOtp);
authRouter.post('/signin', authController.signIn);
authRouter.post('/send-otp', authController.sendOtp);
authRouter.patch('/reset-pass', idempotency(), authController.forgetPassword);
authRouter.post('/login-with-google', authController.loginWithGoogle);
authRouter.get('/users', withCache(60), authController.getAllUsers);

authRouter.post('/upload-profile-pic', guard, uploadSingleFile('file'), authController.uploadProfilePic);

export default authRouter;