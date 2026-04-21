const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { importar } = require('../controllers/uploadController');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('arquivo'), importar);

module.exports = router;
