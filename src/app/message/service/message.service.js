import { ApError } from "../../../pkg/error/error.js";
import * as userRepo from "../../user/repository/user.repository.js";
import * as messageRepo from "../repository/message.repository.js";

export async function sendMessage(message, receiverId, senderId) {
    //check if receiver is exist
    const receiver = await userRepo.FindUserById(receiverId);
    if (!receiver) {
        throw new ApError("Receiver not found");
    }

    //create message
    return await messageRepo.createMessage(message, receiverId, senderId);
}



export async function getAllUserMessages(user_id) {
    //check if user is exist
    const user = await userRepo.FindUserById(user_id);
    if (!user) {
        throw new ApError("User not found");
    }
    //get all messages for the user
    return await messageRepo.findAllMessagesForUser(user_id);
}