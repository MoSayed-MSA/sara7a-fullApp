import { model, Schema } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required:
                function () {
                    return this.provider === 'local';
                },
            minlength: 6
        },
        provider: {
            type: String,
            enum: ['local', 'google', 'facebook'],
            default: 'local'
        },
        profilePic: String,
        isVerified: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        strict: true

    }
);


const User = model('User', userSchema);
export default User;