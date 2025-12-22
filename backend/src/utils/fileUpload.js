const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(
            null,
            `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`
        );
    }
});

// File type validation
function fileFilter(req, file, cb) {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and image files are allowed"));
    }
}

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;