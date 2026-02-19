const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');

// POST /api/upload
router.post('/', (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary Error:', err);
            return res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        console.log('File uploaded:', req.file);

        // Cloudinary returns the file info in req.file
        // Ensure secure_url is present (sometimes mapped to path in multer)
        const fileUrl = req.file.secure_url || req.file.path;

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: { ...req.file, secure_url: fileUrl },
        });
    });
});

module.exports = router;
