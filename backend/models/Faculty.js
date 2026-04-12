const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teachingConfig: [
    {
      year: { type: Number, required: true },
      semester: { type: Number, required: true },
      subjects: [{ type: String }]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Faculty', FacultySchema);
