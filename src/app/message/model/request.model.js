import { model, Schema } from "mongoose";

const requestSchema = new Schema(
    {
        message: {
            type: Schema.Types.ObjectId,
            ref: "Message",
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true, // The owner of the anonymous message
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true, // The user who received the message and requests identity
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        }
    },
    {
        timestamps: true,
        strict: true
    }
);

export const Request = model('Request', requestSchema);