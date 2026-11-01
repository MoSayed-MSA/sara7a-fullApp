import { Message } from "../model/message.model.js";

export async function createMessage(message, reciverId, senderId) {
    return Message.create({
        content: message,
        receiver: reciverId,
        sender: senderId
    })
}

export async function findAllMessagesForUser(userId) {
    return Message.find({ receiver: userId }).populate({ path: "sender", select: "-password" });
}

export async function findAllUserMessages(userId) {
    const messages = await Message.find({ receiver: userId, isDeleted: false }).sort({ createdAt: -1 });

    // Check if identity conversation is unlocked for each message
    const enrichedMessages = await Promise.all(messages.map(async (msg) => {
        const conversation = await Conversation.findOne({ message: msg._id });
        let senderData = null;

        if (conversation) {
            // If conversation exists, identity is revealed
            const User = (await import("../../user/model/user.model.js")).default;
            senderData = await User.findById(msg.sender).select("-password");
        }

        return {
            _id: msg._id,
            content: msg.content,
            receiver: msg.receiver,
            sender: senderData, // Null if anonymous, populated if accepted
            isAnonymous: !conversation,
            createdAt: msg.createdAt
        };
    }));

    return enrichedMessages;
}