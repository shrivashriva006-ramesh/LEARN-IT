const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    codeSnippet: {
      type: String,
      default: '',
    },
    options: {
      type: [String],
      validate: [val => val.length === 4, 'Question must have exactly 4 options'],
      required: true,
    },
    correctAnswer: {
      type: Number,
      required: true, // 0, 1, 2, or 3
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    questions: [questionSchema],
    totalMarks: {
      type: Number,
      default: 30,
    },
    passingPercentage: {
      type: Number,
      default: 50,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
