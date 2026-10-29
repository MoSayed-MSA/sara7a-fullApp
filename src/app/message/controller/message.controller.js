import { validateBody } from "../../../lib/validation/validation.js";
import { sendMessageDto } from "../dto/dto.js";
import * as messageService from "../service/message.service.js";

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