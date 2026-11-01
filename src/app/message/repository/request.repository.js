import { Request } from "../model/request.model.js";

export async function createRequest(data) {
    return Request.create(data);
}

export async function findRequest(filter) {
    return Request.findOne(filter);
}

export async function findRequests(filter) {
    return Request.find(filter).populate("receiver", "name email profilePic").populate("message");
}

export async function updateRequestStatus(id, status) {
    return Request.findByIdAndUpdate(id, { status }, { new: true });
}