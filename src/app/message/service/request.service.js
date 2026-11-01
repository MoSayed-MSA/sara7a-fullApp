import * as requestRepo from "../repository/request.repository.js";
import { Message } from "../../message/model/message.model.js";
import { Conversation } from "../model/conversation.model.js";
import { AppError } from "../../../pkg/error/error.js";

export async function createIdentityRequest(messageId, receiverId) {
    const message = await Message.findById(messageId);
    if (!message) throw new AppError("Message not found", 404);

    if (message.receiver.toString() !== receiverId) {
        throw new AppError("Unauthorized to request identity for this message", 403);
    }

    // Check if request already exists
    const existingRequest = await requestRepo.findRequest({ message: messageId, receiver: receiverId });
    if (existingRequest) {
        throw new AppError(`Request already exists with status: ${existingRequest.status}`, 400);
    }

    return requestRepo.createRequest({
        message: messageId,
        sender: message.sender,
        receiver: receiverId,
        status: 'pending'
    });
}

export async function getReceivedRequests(userId) {
    // The sender of the original message views requests asking for their identity
    return requestRepo.findRequests({ sender: userId });
}

export async function handleRequestAction(requestId, userId, status) {
    const request = await requestRepo.findRequest({ _id: requestId, sender: userId });
    if (!request) throw new AppError("Request not found or unauthorized", 404);

    if (request.status !== 'pending') {
        throw new AppError("Request has already been processed", 400);
    }

    const updatedRequest = await requestRepo.updateRequestStatus(requestId, status);

    // If accepted, create a conversation between sender and receiver linked to the message
    if (status === 'accepted') {
        const existingConversation = await Conversation.findOne({ message: request.message });
        if (!existingConversation) {
            await Conversation.create({
                message: request.message,
                participants: [request.sender, request.receiver]
            });
        }
    }

    return updatedRequest;
}