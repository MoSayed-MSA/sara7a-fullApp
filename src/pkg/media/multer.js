import multer, { diskStorage } from 'multer';
import { ApError } from '../error/error.js';

function fileUpload(allowedTypes = ['image/png', 'image/jpeg']) {
    return multer({
        fileFilter: function (req, file, cb) {
            if (!allowedTypes.includes(file.mimetype)) {
                return cb(new ApError('invalid file format', 400), false)
            }
            cb(null, true)
        },
        storage: diskStorage({
            destination: 'uploads',
            filename: function (req, file, cb) {
                cb(null, `${Date.now()}-${file.originalname}`);
            }
        })
    });
}

export function uploadSingleFile(fieldName) {
    return fileUpload().single(fieldName);
}

export function uploadFilesArray(fieldName, maxCount) {
    return fileUpload().array(fieldName, maxCount);
}

export function uploadFields(fieldName, maxCount) {
    return fileUpload().fields([{ name: fieldName, maxCount: maxCount }]);
}