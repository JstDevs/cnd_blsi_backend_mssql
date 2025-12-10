const multer = require('multer');

// Store files in memory instead of disk
const storage = multer.memoryStorage();

const uploadBlob = multer({
  storage,
  // Accept all files: images, pdfs, docs, excels, etc.
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type'), false);
  },
  limits: {
    fileSize: 20 * 1024 * 1024, // max 20MB
  },
});

module.exports = uploadBlob;
