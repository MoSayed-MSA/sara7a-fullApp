import { fileTypeFromBuffer } from "file-type";
import fs from "node:fs";
import { ApError } from '../error/error.js'

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = (allowedTypes = ["image/jpeg", "image/png"]) => async (req, res, next) => {
    try {
        if (req.file.size > 2 * 1024 * 1024) {
            throw new ApError("File size exceeds the limit of 2MB", 400);
        }
        // get the file path
        const filePath = req.file.path;
        // read the file and return buffer
        const buffer = fs.readFileSync(filePath);
        // get the file type
        const type = await fileTypeFromBuffer(buffer);
        // validate
        if (!type || !allowedTypes.includes(type.mime)) {
            fs.unlinkSync(filePath);
            return next(new ApError("Invalid file type", 400));
        }

        return next();
    } catch (error) {
        return next(new ApError("Internal server error"));

    }
}