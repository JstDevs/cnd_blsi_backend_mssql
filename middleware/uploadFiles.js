const multer = require('multer');
const path = require('path');
const fs = require('fs');

const BASE_UPLOAD_DIR = 'public/uploads';

const createUploader = (subPath = 'undefined') => {
  const fullPath = path.join(BASE_UPLOAD_DIR, subPath);

  // Ensure the directory exists
  fs.mkdirSync(fullPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      req.uploadPath = subPath; // store relative path on req
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext); // e.g., "mylogo"
      const timestamp = Date.now(); // current timestamp
      const uniqueName = `${baseName}_${timestamp}${ext}`; // e.g., "mylogo_1721455432113.png"
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      // Images
      'image/jpeg',
      'image/png',
      'image/webp',
      // Documents
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, WEBP, PDF, Word, and Excel files are allowed'), false);
  };

  // ✅ Return the actual multer instance
  return multer({ storage, fileFilter });
};

module.exports = createUploader;
