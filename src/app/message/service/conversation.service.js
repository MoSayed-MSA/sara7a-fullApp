import { Conversation } from "../model/conversation.model.js";
import { ConversationMessage } from "../model/conversation-message.model.js";
import { AppError } from "../../../pkg/error/error.js";

export async function getUserConversations(userId) {
    return Conversation.find({ participants: userId })
        .populate("participants", "name email profilePic")
        .populate("message", "content createdAt");
}

export async function sendMessageInConversation(conversationId, senderId, content) {
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: senderId
    });

    if (!conversation) {
        throw new AppError("Conversation not found or unauthorized", 403);
    }

    return ConversationMessage.create({
        conversation: conversationId,
        sender: senderId,
        content
    });
}

export async function getConversationMessages(conversationId, userId) {
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId
    });

    if (!conversation) {
        throw new AppError("Conversation not found or unauthorized", 403);
    }

    return ConversationMessage.find({ conversation: conversationId })
        .populate("sender", "name email profilePic")
        .sort({ createdAt: 1 });
}