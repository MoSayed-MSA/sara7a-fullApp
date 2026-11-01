import { model, Schema } from "mongoose";

const conversationSchema = new Schema(
    {
        message: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            required: true,
            unique: true,
        },
        participants: [{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }],
    },
    {
        timestamps: true,
        strict: true
    }
);

export const Conversation = model('Conversation', conversationSchema);