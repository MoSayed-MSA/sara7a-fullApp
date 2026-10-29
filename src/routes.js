import authRouter from './app/auth/auth.route.js'
import userRouter from './app/user/user.route.js'
import messageRouter from './app/message/message.route.js'

import Router from 'express';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/message', messageRouter);

export default router;