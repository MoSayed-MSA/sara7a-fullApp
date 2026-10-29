import User from "../model/user.model.js";

export async function FindUserById(id) {
    return await User.findOne({ _id: id, isDeleted: false }, { password: 0 })
}