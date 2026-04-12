const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Faculty = require('../models/Faculty');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, employeeId, password, teachingConfig } = req.body;
    
    let faculty = await Faculty.findOne({ $or: [{ email }, { employeeId }] });
    if (faculty) {
      return res.status(400).json({ message: 'Faculty already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    faculty = new Faculty({
      name,
      email,
      employeeId,
      password: hashedPassword,
      teachingConfig
    });

    await faculty.save();

    const payload = { id: faculty._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, faculty: { id: faculty._id, name: faculty.name, teachingConfig: faculty.teachingConfig } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { id: faculty._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, faculty: { id: faculty._id, name: faculty.name, teachingConfig: faculty.teachingConfig } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
