const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.fields([{ name: 'answerKey', maxCount: 1 }, { name: 'studentSheet', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files || !req.files.answerKey || !req.files.studentSheet) {
      return res.status(400).json({ message: 'Missing files' });
    }

    const answerKey = req.files.answerKey[0];
    const studentSheet = req.files.studentSheet[0];

    const formData = new FormData();
    formData.append('answer_key', answerKey.buffer, { filename: answerKey.originalname });
    formData.append('student_sheet', studentSheet.buffer, { filename: studentSheet.originalname });

    const aiResponse = await axios.post('http://127.0.0.1:8000/evaluate', formData, {
      headers: {
        ...formData.getHeaders()
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    res.json(aiResponse.data);
  } catch (error) {
    console.error('Error forwarding to AI proxy:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error evaluating the response', details: error.message });
  }
});

module.exports = router;
