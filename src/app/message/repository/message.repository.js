import { Message } from "../model/message.model.js";

export async function createMessage(message, reciverId, senderId) {
    return Message.create({
        content: message,
        receiver: reciverId,
        sender: senderId
    })
}

export async function findAllMessagesForUser(userId) {
    return Message.find({ receiver: userId }).populate({path: "sender", select:"-password"});
}