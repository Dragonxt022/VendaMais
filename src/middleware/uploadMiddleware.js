const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createDirectoryPath = (baseDir, subDir = '') => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  const fullPath = path.join(baseDir, subDir, year.toString(), month);
  ensureDirectoryExists(fullPath);
  
  return fullPath;
};

const generateUniqueFileName = (file) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(file.originalname);
  return `${timestamp}_${randomString}${ext}`;
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo inválido. Apenas JPEG, PNG, GIF e WebP são permitidos.'), false);
  }
};

const createUploadMiddleware = (options = {}) => {
  const {
    destination = 'src/public/uploads',
    subDirectory = '',
    maxFileSize = 5 * 1024 * 1024, // 5MB
    fieldName = 'image'
  } = options;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = createDirectoryPath(destination, subDirectory);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const fileName = generateUniqueFileName(file);
      req.uploadedFileName = fileName;
      req.uploadedFilePath = path.relative(process.cwd(), path.join(createDirectoryPath(destination, subDirectory), fileName));
      cb(null, fileName);
    }
  });

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSize,
      files: 1
    }
  }).single(fieldName);
};

module.exports = {
  createUploadMiddleware,
  ensureDirectoryExists,
  createDirectoryPath,
  generateUniqueFileName,
  fileFilter
};
