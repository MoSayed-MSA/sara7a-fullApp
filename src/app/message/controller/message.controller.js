import { validateBody } from "../../../lib/validation/validation.js";
import { sendMessageDto } from "../dto/dto.js";
import * as messageService from "../service/message.service.js";
import * as requestService from "../service/request.service.js";
import * as conversationService from "../service/conversation.service.js";
import { AppError } from "../../../pkg/error/error.js";
import { successResponse } from "../../../pkg/utils/successRes.js";

// --- Message Controllers ---
export async function sendMessage(req, res, next) {
    try {
        validateBody(sendMessageDto, req.body);
        const { content, receiver } = req.body;
        const sender = req.user?.userId;
        const message = await messageService.sendMessage(content, receiver, sender);
        res.status(201).json({ message: "Message sent successfully", data: message });
    } catch (error) {
        next(error);
    }
}

export async function getAllUserMessages(req, res, next) {
    try {
        const user_id = req.user?.userId;
        const message = await messageService.getAllUserMessages(user_id);
        res.status(201).json({ message: "Messages retrieved successfully", data: message });
    } catch (error) {
        next(error);
    }
}

// --- Request Controllers ---
export async function requestIdentity(req, res, next) {
    try {
        const { messageId } = req.body;
        const receiverId = req.user.userId;
        const request = await requestService.createIdentityRequest(messageId, receiverId);
        successResponse(res, 201, "Identity request created successfully", request);
    } catch (error) {
        next(error);
    }
}

export async function getRequests(req, res, next) {
    try {
        const userId = req.user.userId;
        const requests = await requestService.getReceivedRequests(userId);
        successResponse(res, 200, "Requests retrieved successfully", requests);
    } catch (error) {
        next(error);
    }
}

export async function respondToRequest(req, res, next) {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // 'accepted' or 'rejected'
        const userId = req.user.userId;
        
        if (!['accepted', 'rejected'].includes(status)) {
            return next(new AppError("Invalid status value", 400));
        }

        const request = await requestService.handleRequestAction(requestId, userId, status);
        successResponse(res, 200, `Request ${status} successfully`, request);
    } catch (error) {
        next(error);
    }
}

// --- Conversation Controllers ---
export async function getConversations(req, res, next) {
    try {
        const userId = req.user.userId;
        const conversations = await conversationService.getUserConversations(userId);
        successResponse(res, 200, "Conversations retrieved successfully", conversations);
    } catch (error) {
        next(error);
    }
}

export async function sendConversationMessage(req, res, next) {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        const message = await conversationService.sendMessageInConversation(conversationId, userId, content);
        successResponse(res, 201, "Message sent successfully", message);
    } catch (error) {
        next(error);
    }
}

export async function getConversationMessages(req, res, next) {
    try {
        const { conversationId } = req.params;
        const userId = req.user.userId;

        const messages = await conversationService.getConversationMessages(conversationId, userId);
        successResponse(res, 200, "Conversation messages retrieved successfully", messages);
    } catch (error) {
        next(error);
    }
}