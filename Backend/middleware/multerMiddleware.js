const multer = require("multer")

const errorHandler = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File too large (max 2MB)" });
        }
    }

    // Check for the custom Error thrown in Multer fileFilter
    if (error.message === 'Only images are allowed!') {
        return res.status(400).json({ message: error.message });
    }
    
    res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
    });
};

module.exports = errorHandler;