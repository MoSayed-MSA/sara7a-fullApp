import { Router } from 'express';
import * as messageController from './controller/message.controller.js';
import { guard } from '../../lib/middleware/guard.js';

const messageRouter = Router();

// --- 1. Anonymous & Standard Messages Routes ---
messageRouter.post('/send-message', messageController.sendMessage);
messageRouter.post('/send-message/public', guard, messageController.sendMessage);
messageRouter.get('/get-user-messages', guard, messageController.getAllUserMessages);

// --- 2. Identity Request Routes ---
messageRouter.post('/requests', guard, messageController.requestIdentity);
messageRouter.get('/requests', guard, messageController.getRequests);
messageRouter.patch('/requests/:requestId', guard, messageController.respondToRequest);

// --- 3. Conversation & Conversation Messages Routes ---
messageRouter.get('/conversations', guard, messageController.getConversations);
messageRouter.post('/conversations/:conversationId/messages', guard, messageController.sendConversationMessage);
messageRouter.get('/conversations/:conversationId/messages', guard, messageController.getConversationMessages);

export default messageRouter;