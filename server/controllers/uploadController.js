const path = require('path');
const fs = require('fs');
const { uploadDir } = require('../middleware/uploadMiddleware');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        const { originalname, filename, mimetype, size } = req.file;
        const relativeUrl = `/uploads/${filename}`;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const absoluteUrl = `${baseUrl}${relativeUrl}`;

        res.status(201).json({
            success: true,
            data: {
                url: absoluteUrl,
                relativeUrl,
                filename: originalname,
                mime: mimetype,
                size,
                storagePath: path.join(uploadDir, filename)
            },
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            error: 'Upload failed',
            message: error.message
        });
    }
};

module.exports = {
    uploadImage
};
