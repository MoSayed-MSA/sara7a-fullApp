// schema
import { model, Schema } from "mongoose";

const otpSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            length: 6,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        expiredAt: {
            type: Date,
            index: { expires: 0 },
        }
    },
    {
        timestamps: true,
        strict :true
    }
)
// model

const OTP = model("OTP", otpSchema);
export default OTP;