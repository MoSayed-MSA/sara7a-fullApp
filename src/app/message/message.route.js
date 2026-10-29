import { Router } from 'express';
import * as messageController from './controller/message.controller.js';
import { guard } from '../../lib/middleware/guard.js';

const messageRouter = Router();

messageRouter.post('/send-message', messageController.sendMessage);
messageRouter.post('/send-message/public', guard, messageController.sendMessage);
    messageRouter.get('/get-user-messages', guard, messageController.getAllUserMessages);


export default messageRouter;