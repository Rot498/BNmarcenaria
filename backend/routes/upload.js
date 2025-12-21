const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', auth, upload.single('imagem'), (req, res) => {
  res.json({ arquivo: req.file.filename });
});

module.exports = router;
